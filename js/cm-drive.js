/* ============================================================
   📂 The trainee's Backup Drive: the firm's folder structure, built on Day 1

   A firm keeps a backup drive of every case document in one folder structure everybody knows by heart: a
   Case Manager covering someone else's file still finds the executed retainer, the demand package and the
   lien correspondence where they always are. Trainees practise that on **their own Google Drive**, and
   they build it **on Day 1** — file management is a habit, not a module, and a trainee who builds their
   drive on Day 4 has spent three days putting documents nowhere.

   The structure is the case file this course already teaches. `CM_CF_DOC_FOLDERS` is the file the course
   works from, intake through litigation; the firm's drive is that same file as folders, numbered in the
   order the case runs. So a document filed in the CMS (js/cm-doc-filing.js) already knows its folder, and
   the copy kept here needs no second decision from the trainee.

   What the trainee does:
     1. Links one folder of their own Google Drive once, the way the Foundations training links a trainee's Drive
        (no Google sign-in): they make a folder named LSH Case Backups, share it with the platform's address (its
        service account, which the Worker gives as `shareWith`) as Editor, and paste the folder's link in this panel
        (🔗 Link my Google Drive in step 1 of Day 1's Backup File Maintenance slide opens it). The platform reads and
        writes in that folder and nothing else in their Drive.
     2. Lays the firm's structure out themselves — adds each folder, names it, nests it, puts it in order.
        Nothing is prefilled: the structure is the thing being learned, so it is typed, not accepted.
     3. Submits it, and the Worker grades it against the firm's standard (FOLDER_STANDARD in worker.js,
        the one place it is written down) folder by folder, each problem with the rule behind that folder.
        A layout that is right is then made in their Drive exactly as they laid it out.
     4. Keeps it. ↻ Check my drive asks Google whether every folder is still there and names any somebody
        deleted; 🔁 Put the missing folders back makes them again.
     5. Names every file the firm's way. 🏷 The naming convention (the one a document is filed under in the CMS)
        is shown wherever the drive is worked on: this panel, the dashboard card, Day 1's slide and each day's
        Backup File Maintenance task, with a filled example to copy. Every time the drive is checked or graded
        the Worker reads every name on it and lists each wrong one with its folder, the name it should have and
        the part that differs. The rule, its wording and the check are the Worker's (FILE_NAME_PATTERN,
        driveNaming in worker.js): this file only draws them. On a slide the box is one row (or, on Day 1, a card in
        the empty corner beside the firm's standard), so it costs the slide no size; names to fix are said where the
        trainee is: a red line on the slide, the card and the panel, and one toast when the list has changed.

   The server side is /api/drive in worker.js (every action, the grading and the Google tokens, which are
   sealed and never leave it). This file is the page: the dashboard card, the setup panel and the Drive
   copy of a filed document. Until GDRIVE_SA_EMAIL and GDRIVE_SA_KEY are set on the Worker, the card is still
   there (🔗 Link my Google Drive) and says linking isn't switched on yet, ask your trainer; nothing else is blocked.
   A page the Worker doesn't take for a trainee (DRIVE_NOT_A_TRAINEE) is told to sign in as a trainee instead.
   CMDrive.show() opens the panel from anywhere; CMDrive.launch() (🚀 Launch CMS & Google Drive, js/cm-sb-task.js) opens the linked
   Drive at the trainee's case folder in a new tab, or the panel when nothing is linked yet. Once linked, the card and
   the panel link to 📁 the Drive (LSH Case Backups) and 📁 the case folder (01 Clients/Doe-John); a trainer opens the
   same from 🔗 Trainee Drives (js/cm-drive-admin.js).
   ============================================================ */
(function(){
const esc = (s)=> String(s == null ? "" : s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const say = (m)=> { if(typeof toast === "function") toast(m); };
const GLOGO = '<svg width="13" height="13" viewBox="0 0 87.3 78" aria-hidden="true" style="vertical-align:-2px;margin-right:5px"><path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/><path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"/><path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/><path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/><path fill="#2684fc" d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/><path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/></svg>';

let D = null;                  // the drive, as the Worker reports it
let asked = false, settled = false, busy = false, connecting = false, err = "", open = false;   // settled: the status call has answered (or failed)
let linkErr = "", linkUrl = "";      // why the last try to link didn't finish (shown in step 1 of the slide), and the link typed
let linkHeld = false;                // the keyboard was on the slide's link button when it was last drawn
let graded = null, verified = null;
let tree = null;               // the layout the trainee is building: [{name, children:[…]}]

const signedTrainee = ()=> typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;
/* A trainee on their own screen: the only place a drive is linked from. Never a trainer, an admin's preview, or the
   slides window a presenter shares (js/cm-updates.js), where the slide's button is a sample to point at. */
const ownScreen = ()=> signedTrainee() && !(typeof PV_IS_AUDIENCE !== "undefined" && PV_IS_AUDIENCE);

/* ---------- the server ---------- */
async function api(body){
  const ctl = typeof AbortController === "function" ? new AbortController() : null, tm = ctl && setTimeout(()=>ctl.abort(), 20000);
  let r;
  try{ r = await fetch("/api/drive", {method:"POST", signal: ctl ? ctl.signal : undefined, headers:Object.assign({"Content-Type":"application/json"}, typeof authHeaders === "function" ? authHeaders() : {}), body:JSON.stringify(body || {action:"status"})}); }
  catch(e){ throw new Error(e && e.name === "AbortError" ? "Your Backup Drive didn't answer in time. Try again." : "Your Backup Drive couldn't be reached. Check your connection, then try again."); }
  finally{ if(tm) clearTimeout(tm); }
  let j = {}; try{ j = await r.json(); }catch(e){}
  if(!r.ok){
    const e = new Error(j.error || `The Backup Drive request failed (${r.status}).`);
    e.code = j.code || (r.status === 403 ? "DRIVE_NOT_A_TRAINEE" : "");
    if(D && (e.code === "DRIVE_RECONNECT" || e.code === "DRIVE_NOT_CONNECTED")) D = Object.assign({}, D, {connected:false, email:""});
    throw e;
  }
  return j;
}
/* The status, once. Never render() from here: this runs while the page is still booting, and a redraw
   then would rewrite the address the trainee arrived on (a lab opened in its own tab would come back as
   the dashboard). The card draws itself into its own slot instead. */
async function load(force){
  if(!signedTrainee() || (asked && !force)) return;
  asked = true;
  try{ D = (await api()).drive; err = ""; }
  catch(e){
    // 403: this page isn't a trainee as far as the Worker is concerned (an open-mode Worker has no
    // trainee tokens at all). Nothing to show and nothing to report — the program carries on.
    // (said so: it is the sign-in to fix, not a switch for the trainer)
    if(e.code === "DRIVE_NOT_A_TRAINEE"){ D = {configured:false, notTrainee:true}; try{ await loadStandard(); }catch(x){} }
    else err = e.message;
  }
  settled = true;
  paint(); fillSlot();
  redrawSlides();                            // Day 1's slide ticks the trainee's own steps
  refreshBoxes();                            // 🏷 and every naming box on the page
  if(D && D.connected && D.built) grade();   // and the drive is graded as it stands today
}
function fillSlot(){
  const slot = document.getElementById("drvCardSlot");
  if(slot && !open) slot.innerHTML = card();
}

/* ---------- the dashboard card: Day 1's first job, then a status line ---------- */
function card(){
  if(!signedTrainee()) return "";
  if(!D && !settled){ load(); return ""; }
  // 🔗 Always there for a trainee: when linking isn't switched on (or the status couldn't be read), the card says so
  // and its button opens the panel, which says what to do and shows the steps to come.
  if(!D || !D.configured) return `<div class="drv-card drv-todo" data-drv-off>
    <div class="drv-c-h">🔗 Link my Google Drive</div>
    <p>${D ? offLine() : "Your Google Drive link couldn't be checked just now."} Once it is linked, your case work is kept in your own Google Drive, in your case folders, where your trainer can check it.</p>
    <button type="button" class="btn btn-navy btn-sm" onclick="CMDrive.show()">🔗 Link my Google Drive</button>
  </div>`;
  const n = (D.standard || []).length;
  if(!D.built) return `<div class="drv-card drv-todo">
    <div class="drv-c-h">${D.connected ? "📂 Day 1 · Build your case folders" : "🔗 Day 1 · Link your Google Drive"}</div>
    <p>Every document you file in the CMS is also kept on the firm's backup drive, in the same case file you work from here — intake, records, bills, liens, litigation. Before Day 1's first block, link a folder of your own Google Drive and lay the firm's ${n}-folder structure out in it yourself. It is graded, and it is where your work goes for the rest of the programme.</p>
    ${steps()}
    ${namingBox({day:1, compact:true})}
    <button type="button" class="btn btn-navy btn-sm" onclick="CMDrive.show()">${D.connected ? "📂 Build my folders" : "🔗 Link my Google Drive"}</button>
    ${openLinks()}
  </div>`;
  const missing = (D.lastMissing || []).length, W = wrongOf((rule() || {}).report), misnamed = W.n;
  return `<div class="drv-card ${missing || misnamed ? "drv-warn" : "drv-ok"}">
    <div class="drv-c-h">📂 Backup Drive ${missing ? `· ${missing} folder${missing === 1 ? "" : "s"} missing` : misnamed ? `· ${W.words} to fix` : "· in order"}</div>
    <p>${missing ? `${missing} of the firm's folders ${missing === 1 ? "is" : "are"} no longer in your Drive. A document filed into a folder that isn't there is a document the firm has lost.`
      : `The firm's ${n} folders are in your Drive${D.email ? ` (${esc(D.email)})` : ""}${(D.saved || []).length ? `, holding ${(D.saved || []).length} filed document${(D.saved || []).length === 1 ? "" : "s"}` : ""}.`}</p>
    ${steps()}
    ${namingBox({day:0, compact:true})}
    ${gradeLine()}
    <button type="button" class="btn ${missing ? "btn-navy" : "btn-ghost"} btn-sm" onclick="CMDrive.show()">📂 Open my Backup Drive</button>
    ${openLinks()}
  </div>`;
}
/* Said wherever linking isn't switched on for this site (the card, the panel, Day 1's slide). */
const OFF_LINE = "Google Drive linking isn't switched on for this site yet — ask your trainer.";
/* ...and where the Worker doesn't take this page for a trainee (DRIVE_NOT_A_TRAINEE): the sign-in is what to fix. */
const NOT_TRAINEE_LINE = "Sign in as a trainee to link your Google Drive: open the program from the LSH Training Portal, signed in as yourself.";
// (only where linking IS switched on, as the Worker's standard says: an open-mode test site without the keys is just "off")
const notTrainee = () => !!(D && D.notTrainee && STD && STD.configured === true);
const offLine = () => notTrainee() ? NOT_TRAINEE_LINE : OFF_LINE;
/* 📁 Open my Drive ↗ (the LSH Case Backups folder, the firm's structure in it) and, once built, 📁 my case folder ↗
   (01 Clients/Doe-John), each in a new tab. Only the Worker's own Drive addresses are linked. */
const driveHref = (u)=> /^https:\/\/drive\.google\.com\//.test(String(u || "")) ? String(u) : "";
function openLinks(){
  if(!D || !D.connected) return "";
  const root = driveHref(D.rootUrl), kase = driveHref(D.caseUrl);
  return `${root ? `<a class="btn btn-ghost btn-sm drv-open" data-drv-open href="${esc(root)}" target="_blank" rel="noopener noreferrer">📁 Open my Drive ↗</a>` : ""}${kase ? ` <a class="btn btn-ghost btn-sm drv-open" data-drv-case href="${esc(kase)}" target="_blank" rel="noopener noreferrer">📁 My case folder ↗</a>` : ""}`;
}
/* 🔗 Launch Google Drive (for a Skill Building activity's button): the trainee's linked Drive, at their case folders, in a
   new tab; or, not linked yet (or linking isn't switched on), the panel with the steps. Returns whether a tab opened. */
function launch(){
  const u = D && D.connected ? driveHref(D.caseUrl) || driveHref(D.rootUrl) : "";
  if(u && signedTrainee()){ try{ window.open(u, "_blank", "noopener"); return true; }catch(e){} }
  show(); return false;
}
function gradeLine(){
  const g = (D && D.grades) || {}, parts = [];
  if(D && D.setup) parts.push(`Day 1 ${D.setup.score}%`);
  Object.keys(g).sort().forEach(n=>parts.push(`Day ${n} ${g[n].score}%`));
  return parts.length ? `<p style="margin:0 0 10px;font-size:12.5px;font-weight:700;">🏅 ${parts.join(" · ")}</p>` : "";
}
/* The job in three steps, each ticked when done. Your trainer sees the same three in the Trainee Audit. */
function steps(){
  const saved = (D.saved || []).length, missing = (D.lastMissing || []).length;
  const li = (done, text)=>`<li style="${done ? "color:var(--success);" : ""}">${done ? "✓" : "○"} ${text}</li>`;
  return `<ol class="drv-steps" style="list-style:none;margin:6px 0 10px;padding:0;font-size:12.5px;line-height:1.7;">
    ${li(!!D.connected, "Link your Google Drive folder")}
    ${li(!!D.built && !missing, "Build the firm's folders" + (missing ? ` — ${missing} missing, put them back` : ""))}
    ${li(saved > 0, "Keep every document you file backed up in its folder, named the firm's way" + (saved ? ` (${saved} so far)` : ""))}
  </ol>`;
}
/* The dashboard asks for the card through its own slot, so it can be redrawn on its own later without
   redrawing (and re-routing) the whole page. */
function slot(){ return `<div id="drvCardSlot">${card()}</div>`; }

/* ---------- the panel ---------- */
function show(to){ open = true; if(!D) load(settled); if(!tree) tree = [{name:"", children:[]}]; paint(); if(to === "names") toNames(); }
/* 🏷 N names to fix ↓ : the panel is scrolled to the report of the names, which takes the keyboard too. */
function toNames(){
  const el = document.querySelector("#cmDriveHost .drv-nr");
  if(!el) return;
  const calm = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  try{ el.scrollIntoView({block:"start", behavior: calm ? "auto" : "smooth"}); }catch(e){ try{ el.scrollIntoView(); }catch(x){} }
  try{ el.focus({preventScroll:true}); }catch(e){}
}
function close(){ open = false; graded = null; verified = null; paint(); fillSlot(); }

function toPaths(nodes, prefix){
  const out = [];
  (nodes || []).forEach(n=>{
    const name = String(n.name || "").trim();
    if(!name) return;
    const path = prefix ? prefix + "/" + name : name;
    out.push(path);
    toPaths(n.children, path).forEach(p=>out.push(p));
  });
  return out;
}
// address a node by its path of indexes, e.g. "0.2.1"
function at(addr){
  const bits = String(addr).split(".").filter(s=>s !== "");
  let level = tree, node = null;
  bits.forEach(b=>{ node = level[Number(b)]; level = node ? node.children : []; });
  return node;
}
function parentOf(addr){
  const bits = String(addr).split(".").filter(s=>s !== "");
  const i = Number(bits.pop());
  return {list: bits.length ? at(bits.join(".")).children : tree, i};
}
function setName(addr, v){ const n = at(addr); if(n) n.name = v; }
function addSub(addr){ const n = at(addr); if(n){ n.children.push({name:"", children:[]}); paint(); } }
function addTop(){ tree.push({name:"", children:[]}); paint(); }
function remove(addr){ const {list, i} = parentOf(addr); list.splice(i, 1); if(!tree.length) tree.push({name:"", children:[]}); paint(); }
function move(addr, by){ const {list, i} = parentOf(addr); const j = i + by; if(j < 0 || j >= list.length) return; const [x] = list.splice(i, 1); list.splice(j, 0, x); paint(); }

function rowsHTML(nodes, addr, depth){
  return (nodes || []).map((n,i)=>{
    const a = addr === "" ? String(i) : `${addr}.${i}`;
    return `<div class="drv-row" style="margin-left:${depth * 20}px">
      <span class="drv-ic">📁</span>
      <input class="drv-in" value="${esc(n.name)}" spellcheck="false" autocomplete="off" placeholder="Folder name"
             oninput="CMDrive.name('${a}', this.value)">
      <button type="button" class="drv-mini" title="Add a folder inside this one" onclick="CMDrive.addSub('${a}')">➕</button>
      <button type="button" class="drv-mini" title="Move up" onclick="CMDrive.move('${a}',-1)">↑</button>
      <button type="button" class="drv-mini" title="Move down" onclick="CMDrive.move('${a}',1)">↓</button>
      <button type="button" class="drv-mini" title="Remove this folder" onclick="CMDrive.remove('${a}')">✕</button>
    </div>${rowsHTML(n.children, a, depth + 1)}`;
  }).join("");
}

/* 🔗 How to link, step by step: make the folder, share it as Editor with the address shown, copy its link, paste and Link.
   With no address (linking not switched on yet) the steps are shown as what is to come. */
function linkSteps(root, sa){
  return `<ol class="drv-link-steps" data-drv-steps>
    <li>Open <a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener noreferrer">Google Drive ↗</a> and make a new folder named <b>${esc(root)}</b> (New → New folder).</li>
    <li>Right-click the folder → <b>Share</b>. Paste ${sa ? `this address: <code class="drv-sa">${esc(sa)}</code> <button type="button" class="drv-mini" data-copy="${esc(sa)}" onclick="CMDrive.copy(this)">📋 Copy</button>` : "the platform's address (it is shown here once linking is switched on)"}. Give it access as <b>Editor</b>, then press <b>Send</b>.</li>
    <li>Open the folder and copy its link from your browser's address bar.</li>
    <li>Paste the link ${sa ? "in the box below" : "here"} and press <b>🔗 Link my folder</b>.</li>
  </ol>`;
}
function paint(){
  let host = document.getElementById("cmDriveHost");
  if(!open){ if(host) host.remove(); return; }
  if(!host){ host = document.createElement("div"); host.id = "cmDriveHost"; document.body.appendChild(host); }
  const n = D ? (D.standard || []).length : 0;
  let body;
  if(!D && !signedTrainee()) body = `<p class="drv-p">Each trainee opens their own Backup Drive, signed in as themselves. A trainer sees every trainee's drive and grades in the 📋 Batch Sheet and the Trainee Audit.</p>`;
  else if(!D && settled) body = `<p class="drv-p">Your Backup Drive couldn't be checked just now.</p><button type="button" class="drv-btn drv-go" onclick="CMDrive.retry()">↻ Try again</button>`;
  else if(!D) body = `<p class="drv-p">Checking your Backup Drive…</p>`;
  else if(!D.configured) body = `<div class="drv-bad drv-off" data-drv-off><b>${offLine()}</b> Nothing else in the course is blocked.</div>
      <p class="drv-p">${notTrainee() ? "Once you're signed in as a trainee" : "When it is switched on"}, linking takes two minutes:</p>
      ${linkSteps(D.root || "LSH Case Backups", "")}`;
  else if(!D.connected){
    const sa = D.shareWith || "";
    body = `<p class="drv-p">Your Backup Drive is one folder in your own Google Drive — a personal Gmail account is fine. Share it with the platform and it reads and writes in that folder only, nothing else in your Drive. Everything in it stays yours, and your trainer can check your case work there.</p>
      ${D.relink ? `<div class="drv-bad">The Backup Drive no longer uses a Google sign-in. Share your <b>${esc(D.root)}</b> folder with the platform (step 2) and paste its link (steps 3 and 4): your folders and grades are kept.</div>` : ""}
      ${linkSteps(D.root, sa)}
      <div class="drv-link-row"><input id="drvLinkUrl" class="drv-in" type="url" placeholder="https://drive.google.com/drive/folders/…" value="${esc(linkUrl)}" oninput="CMDrive.linkInput(this.value)" onkeydown="if(event.key==='Enter')CMDrive.linkFolder()">
        <button type="button" class="drv-btn drv-go" onclick="CMDrive.linkFolder()" ${connecting ? "disabled" : ""}>${GLOGO}${connecting ? "Linking…" : "🔗 Link my folder"}</button></div>`;
  } else if(!D.built){
    body = `<p class="drv-p">Lay the firm's structure out as you would build it in a real practice: ${n} folders, named and nested and in order. It is the case file you already work from here — intake and retainer, the police report, records apart from bills, liens, wages and costs, property damage, litigation — plus the firm's own folders. Nothing is filled in for you. Press <b>Check and build it in my Drive</b> when it is how you would hand it to a colleague.</p>
      <div class="drv-tree">${rowsHTML(tree, "", 0)}</div>
      <button type="button" class="drv-mini drv-add" onclick="CMDrive.addTop()">➕ Add a top-level folder</button>
      ${namingBox({day:1})}
      ${graded ? (graded.ok
        ? `<div class="drv-good"><b>Right${(D.setup && D.setup.attempts > 1) ? ` — on attempt ${D.setup.attempts}` : " first time"}.</b> The structure is in your Drive now.</div>`
        : `<div class="drv-bad"><b>Not built yet — ${graded.score}% of the structure is right.</b><ul>${graded.problems.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`) : ""}`;
  } else {
    const missing = (verified ? verified.missing : D.lastMissing) || [];
    const saved = D.saved || [];
    body = `<p class="drv-p">The firm's ${n} folders are in your Drive${D.folderName ? `, in <b>${esc(D.folderName)}</b>` : ""}${D.email ? ` (${esc(D.email)})` : ""}. Keeping them there is part of the job: every document you file in the CMS is also saved into its folder here.</p>
      <div class="drv-tree drv-read">${(D.standard || []).map(p=>{
        const depth = p.split("/").length - 1, name = p.split("/").pop(), gone = missing.includes(p);
        const held = saved.filter(s=>s.folder === p).length;
        return `<div class="drv-row drv-static ${gone ? "is-gone" : ""}" style="margin-left:${depth * 20}px" title="${esc((D.why || {})[p] || "")}">
          <span class="drv-ic">${gone ? "⚠" : "📁"}</span><span class="drv-nm">${esc(name)}</span>
          ${gone ? `<span class="drv-tag">missing from your Drive</span>` : ""}
          ${held ? `<span class="drv-tag drv-tag-ok">${held} document${held === 1 ? "" : "s"}</span>` : ""}
        </div>`;
      }).join("")}</div>
      <div class="drv-verdict">${missing.length ? `<div class="drv-bad"><b>${missing.length} folder${missing.length === 1 ? " is" : "s are"} no longer in your Drive.</b> A document filed into a folder that isn't there is a document the firm has lost.</div>`
        : verified ? `<div class="drv-good"><b>Every folder is where it should be.</b> Checked just now.</div>` : ""}${jumpToNames()}</div>
      ${namingReport()}
      ${namingBox({day:0})}
      ${gradesHTML()}`;
  }
  const foot = !D || !D.configured || !D.connected ? "" :
    !D.built ? `<button type="button" class="drv-btn drv-go" onclick="CMDrive.submit()" ${busy ? "disabled" : ""}>${busy ? "Checking…" : "Check and build it in my Drive"}</button>
                <button type="button" class="drv-btn" onclick="CMDrive.disconnect()">Unlink folder</button>`
    : `<button type="button" class="drv-btn" onclick="CMDrive.check()" ${busy ? "disabled" : ""}>${busy ? "Checking…" : "↻ Check my drive"}</button>
       <button type="button" class="drv-btn" onclick="CMDrive.grade(true)" ${grading ? "disabled" : ""}>${grading ? "Grading…" : "🏅 Grade my backup"}</button>
       ${((verified ? verified.missing : D.lastMissing) || []).length ? `<button type="button" class="drv-btn drv-go" onclick="CMDrive.rebuild()" ${busy ? "disabled" : ""}>🔁 Put the missing folders back</button>` : ""}
       ${driveHref(D.rootUrl) ? `<a class="drv-btn" data-drv-open href="${esc(D.rootUrl)}" target="_blank" rel="noopener noreferrer">📁 Open my Drive ↗</a>` : ""}
       ${driveHref(D.caseUrl) ? `<a class="drv-btn" data-drv-case href="${esc(D.caseUrl)}" target="_blank" rel="noopener noreferrer">📁 My case folder ↗</a>` : ""}
       <button type="button" class="drv-btn" onclick="CMDrive.disconnect()">Unlink folder</button>`;

  host.innerHTML = `<div class="drv-wrap" role="dialog" aria-modal="true" aria-label="My Backup Drive">
    <div class="drv-cardw">
      <div class="drv-head">
        <div><div class="drv-eyebrow">Day 1 · File management</div><h3>📂 My Backup Drive</h3></div>
        ${D && D.configured && D.connected && D.built ? jumpToNames("drv-nm-top") : ""}
        <button type="button" class="drv-x" onclick="CMDrive.close()" aria-label="Close">✕</button>
      </div>
      <div class="drv-body">${body}${err ? `<div class="drv-bad">${esc(err)}</div>` : ""}</div>
      <div class="drv-foot">${foot}</div>
    </div></div>`;
}

/* ---------- 🔗 linking the trainee's folder (as the Foundations training links a trainee's Drive: shared, then pasted) ---------- */
/* A try to link that didn't finish: said once as a toast, and kept as a line in step 1 of the slide until the next try. */
function linkFail(m){ linkErr = m; say(m); paint(); redrawSlides(); }
function linkInput(v){ linkUrl = String(v || ""); }
async function linkFolder(){
  if(!D || !D.configured || connecting) return;
  const el = document.getElementById("drvLinkUrl"); if(el) linkUrl = el.value;
  const url = String(linkUrl || "").trim();
  if(!/^https:\/\/drive\.google\.com\//i.test(url)){ err = "Paste the folder's link from Google Drive (https://drive.google.com/drive/folders/…)."; paint(); return; }
  connecting = true; err = ""; linkErr = ""; paint(); redrawSlides();
  try{
    const out = await api({action:"link", url});
    D = out.drive; linkUrl = ""; if(!tree) tree = [{name:"", children:[]}];
    say(`Google Drive folder linked${D.folderName ? ` (${D.folderName})` : ""}.${out.built ? " Your Day 1 structure is in it." : ""}`);
    if(D.folderName && D.root && D.folderName !== D.root) say(`Tip: name the folder “${D.root}” in Google Drive, as the firm does.`);
  }catch(e){ err = e.message; linkErr = e.message; }
  connecting = false; paint(); fillSlot(); redrawSlides();
  if(D && D.connected && D.built) grade();
}
/* Said to whoever pressed the sample. The slides window a presenter shares shows nothing but the slide (js/cm-updates.js
   keeps the toast out of it), so there the line is shown the way that window shows its own hint, and fades by itself
   (the animation's end takes it away: no timer); a click dismisses it sooner. */
function saySample(m){
  say(m);
  if(!(typeof PV_IS_AUDIENCE !== "undefined" && PV_IS_AUDIENCE)) return;
  document.querySelectorAll(".drv-aud-say").forEach(el=>el.remove());
  const el = document.createElement("div");
  el.className = "aud-hint drv-aud-say"; el.setAttribute("role", "status"); el.textContent = m;
  el.addEventListener("animationend", ()=>el.remove());
  el.addEventListener("click", ()=>el.remove());
  document.body.appendChild(el);
}
/* 🔗 Link my Google Drive, in step 1 of Day 1's slide. A trainee on their own screen gets the panel, at its three
   steps (make the folder, share it, paste its link); for anyone else the button is a sample (a trainer points at it),
   and pressing it asks nothing of Google or of the Worker. */
async function link(){
  if(!ownScreen()){ saySample("Trainees link their own Google Drive with this button, on their own screen."); return; }
  if(connecting) return;
  if(!D){
    linkErr = ""; await load(true);
    if(!D){ linkErr = err || "Your Backup Drive couldn't be reached. Press the button again."; redrawSlides(); return; }
  }
  if(!D.configured || D.connected){ redrawSlides(); return; }
  show();
  setTimeout(()=>{ const el = document.getElementById("drvLinkUrl"); if(el) try{ el.focus(); }catch(e){} }, 0);
}
async function disconnect(){
  if(!D || !D.connected || busy) return;
  if(!confirm("Unlink your Backup Drive folder? The folder and the files in it stay in your Google Drive, and your grades are kept. You can link it again by its link.")) return;
  busy = true; paint();
  try{ D = (await api({action:"disconnect"})).drive; verified = null; graded = null; err = ""; linkErr = ""; say("Backup Drive folder unlinked."); }
  catch(e){ err = e.message; }
  busy = false; paint(); fillSlot(); redrawSlides();
}

/* ---------- the graded Day 1 setup ---------- */
async function submit(){
  if(busy) return;
  const layout = toPaths(tree, "");
  if(!layout.length){ err = "Add the folders first."; paint(); return; }
  busy = true; err = ""; paint();
  try{
    const out = await api({action:"setup", layout});
    graded = out.graded; D = out.drive;
    // The grade also goes into the trainee's own progress, so a trainer reads it in the Trainee Audit
    // beside everything else rather than having to ask the Worker about each trainee's Google account.
    // firstAt: when the first attempt was made, so a structure still not built a day later is a trainer's alert (js/cm-progress-log.js)
    try{ if(typeof storeSet === "function"){ const prev = (typeof storeGet === "function" && await storeGet("drive-setup")) || {};
      await storeSet("drive-setup", {score:graded.score, ok:graded.ok, attempts:(D.setup && D.setup.attempts) || 1, at:new Date().toISOString(), firstAt:prev.firstAt || prev.at || new Date().toISOString(), left:graded.problems.length}); } }catch(e){}
    if(graded.ok) say("Your Backup Drive is built — the structure is in your Drive.");
    else say(`${graded.problems.length} thing${graded.problems.length === 1 ? "" : "s"} to fix before it is built.`);
    fillSlot();
  }catch(e){ err = e.message; }
  busy = false; paint(); redrawSlides();
}
/* The latest ✓ Check my drive, on the trainee's own progress ("drive-check"): how many of the firm's folders were missing,
   which, and when. Their 📒 Progress Log shows it, and a folder still missing is a trainer's case-file alert. */
function keepCheck(missing, putBack){
  try{ if(typeof storeSet === "function") storeSet("drive-check", {missing: missing.length, list: missing.slice(0, 12), at: new Date().toISOString(), putBack: !!putBack}); }catch(e){}
}
async function check(){
  if(busy) return;
  busy = true; err = ""; paint();
  try{ const out = await api({action:"check"}); verified = out.verified; D = out.drive; keepCheck((verified && verified.missing) || []); }
  catch(e){ err = e.message; }
  busy = false; paint(); fillSlot(); redrawSlides(); grade(true);   // and every name on the drive is read with it
}
async function rebuild(){
  if(busy) return;
  busy = true; err = ""; paint();
  try{ const out = await api({action:"rebuild"}); D = out.drive; verified = {missing:[]}; keepCheck([], true); say("The missing folders are back in your Drive."); }
  catch(e){ err = e.message; }
  busy = false; paint(); fillSlot(); redrawSlides(); grade();
}

/* ---------- 🏅 graded as you go: Days 2–5 (the Worker reads the Drive and grades; see driveGrade in worker.js) ----------
   Runs after ✓ Check my drive, 🔁 Put back, a filed copy, and when a day's Backup File Maintenance opens. The grades
   also ride the trainee's progress ("drive-grades"), so the Scorecard and the Trainee Audit read them with the rest. */
const filedIds = ()=>{ const log = (typeof state === "object" && state.docFiling) || {}; return Object.keys(log).filter(k=>log[k] && log[k].filed); };
let grading = false, gradeTimer = null, lastGrade = 0;
function gradeSoon(){ clearTimeout(gradeTimer); gradeTimer = setTimeout(()=>grade(), 1500); }
async function grade(force){
  if(!signedTrainee() || !D || !D.configured || !D.connected || !D.built || grading) return;
  if(!force && Date.now() - lastGrade < 8000) return gradeSoon();
  grading = true; lastGrade = Date.now();
  let read = false;
  try{
    const out = await api({action:"grade", filed: filedIds()});
    D = out.drive; read = true;
    try{ if(typeof storeSet === "function") await storeSet("drive-grades", Object.fromEntries(Object.entries(out.grades || {}).map(([n, g])=>[n, dayRecord(g)]))); }catch(e){}
  }catch(e){ /* the grade waits for the next check; nothing else is blocked */ }
  grading = false; paint(); fillSlot();
  redrawSlides();
  refreshBoxes();
  if(read) tellNames();   // 🏷 one toast when the list of names to fix isn't the one the trainee was last told about
  try{ window.dispatchEvent(new CustomEvent("cm-drive-graded")); }catch(e){}
}
/* A day's grade as it is kept on the trainee's progress ("drive-grades"), where the Scorecard and the Batch Sheet read it.
   names: the 🏷 File names row (points got, of how many, how many names are wrong), so a lower score names its cause.
   issues: the notes to act on, the 🏷 File names note first so the four kept never drop it. The Worker's own
   names / issues are used when it sends them; an older Worker sends only the rows, and they are read from those. */
const NAMES_ROW = "File names";
const notesOf = (rows)=> [].concat(...(rows || []).map(r=>(r && r.notes) || []));
const namesFirst = (rows)=> (rows || []).filter(r=>r && r.label === NAMES_ROW).concat((rows || []).filter(r=>!r || r.label !== NAMES_ROW));
function dayRecord(g){
  g = g || {};
  const rows = g.rows || [], nm = rows.find(r=>r && r.label === NAMES_ROW), sent = g.names && typeof g.names === "object" ? g.names : null;
  const names = sent ? {got:Number(sent.got) || 0, max:Number(sent.max) || 0, wrong:Number(sent.wrong) || 0}
    : nm ? {got:Number(nm.got) || 0, max:Number(nm.max) || 0, wrong:wrongOf((rule() || {}).report).charged} : null;
  const issues = (Array.isArray(g.issues) ? g.issues : notesOf(namesFirst(rows))).slice(0, 4).map(t=>String(t).slice(0, 300));
  return Object.assign({score:g.score, passed:g.passed, at:g.at, issues}, names ? {names} : {});
}
/* 🏷 The trainee is told, once, when the names to fix are not the ones they were last told about: after a grade or
   ✓ Check my drive (which ends in a grade). What they were told is remembered on this browser, per trainee; where
   nothing can be remembered, nothing is said (never the same toast on every grade). No timer and no request of its own. */
function tellNames(){
  const R = D && D.naming && D.naming.report;
  if(!signedTrainee() || !R) return;
  const W = wrongOf(R), key = "cm-drive-names:" + state.traineeId;
  let sig = "";
  if(W.n){ let h = 5381; const t = (R.list || []).map(x=>`${x && x.kind === "folder" ? "d" : "f"}:${x && x.folder}/${x && x.name}`).sort().join("|");
    for(let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0;
    sig = `${W.n}.${h.toString(36)}`; }
  let was = null;
  try{ was = localStorage.getItem(key); if(was !== sig) localStorage.setItem(key, sig); }catch(e){ return; }
  if(was === sig || (was === null && !sig)) return;
  say(W.n ? `🏷 ${W.words} to fix on your Backup Drive. Open 📂 My Backup Drive: each one is listed with the name it should have.`
          : "🏷 Every name on your Backup Drive is the firm's way now.");
}
/* A day's Backup File Maintenance opened: Day 2 lays its drill (the colleague's misfiled invoice) once, then the day is graded. */
const opened = {};
async function dayOpened(n){
  if(opened[n] || !signedTrainee()) return; opened[n] = true;
  if(!D) await load();
  if(!D || !D.configured || !D.connected || !D.built) return;
  if(n === 2 && !(D.drills || []).includes("2")){
    try{ D = (await api({action:"drill", day:2})).drive; say("A colleague filed Summit Imaging's invoice in 03 Medical Records on your drive. Find it and move it."); }catch(e){}
  }
  grade(true);
}
/* The grades as lines: Day 1's structure, then each day graded so far. */
function gradesHTML(){
  const g = (D && D.grades) || {}, days = Object.keys(g).sort();
  const setup = D && D.setup;
  if(!setup && !days.length) return "";
  const pill = (score, passed)=>`<span class="drv-score ${passed ? "is-pass" : "is-low"}">${score}%</span>`;
  return `<div class="drv-grades"><div class="drv-g-h">🏅 Graded as you go</div>
    ${setup ? `<div class="drv-g-row"><b>Day 1 · the firm's folders</b>${pill(setup.score, !!setup.ok)}<small>${setup.ok ? `Built on attempt ${setup.attempts}.` : `${(setup.problems || []).length} thing${(setup.problems || []).length === 1 ? "" : "s"} to fix.`}</small></div>` : ""}
    ${days.map(n=>{ const x = g[n], notes = notesOf(namesFirst(x.rows));   // the 🏷 File names note first: the six shown never drop it
      return `<div class="drv-g-row"><b>Day ${n} · Backup File Maintenance</b>${pill(x.score, x.passed)}
        <small>${(x.rows || []).map(r=>`${r.got === r.max ? "✓" : "○"} ${esc(r.label)} ${r.got}/${r.max}`).join(" · ")}</small>
        ${notes.length ? `<ul>${notes.slice(0, 6).map(t=>`<li>${esc(t)}</li>`).join("")}</ul>` : ""}</div>`; }).join("")}
    <p class="drv-meta">${weightLine()} Graded from your Drive itself, every time you check it or file a document${D.gradedAt ? ` · last graded ${new Date(D.gradedAt).toLocaleString()}` : ""}. Your Case Notes are graded with the rest of the activity.</p>
  </div>`;
}

/* ---------- a document filed in the CMS, kept on the backup drive too ----------
   Called by js/cm-doc-filing.js once the CMS has accepted a document: same bytes, same name, into the
   folder the firm keeps that kind of document in. The document's own folder id (CM_CF_DOC_FOLDERS) picks
   it, so nothing here guesses. The CMS is the file of record, so a drive that isn't connected or set up,
   or anything at all going wrong here, never undoes the filing. */
async function saveFiled(docFolder, name, bytes, docId){
  if(!D || !D.configured || !D.connected || !D.built) return {ok:false, why:"no-drive"};
  const folder = (D.homes || {})[docFolder];
  if(!folder) return {ok:false, why:"no-folder"};
  try{
    const b = new Uint8Array(bytes);
    let s = ""; for(let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
    const b64 = btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const out = await api({action:"put", docFolder, name, mime:"application/pdf", b64, docId: docId || ""});
    D = out.drive;
    gradeSoon();
    return {ok:true, folder};
  }catch(e){ return {ok:false, why:e.message}; }
}

/* ---------- Day 1's Backup File Maintenance slide: the task in four steps, and the firm's standard ----------
   The structure comes from the Worker (action "standard"), never from a copy here, and a presenter (an admin)
   sees it too. A trainee's steps tick as their own drive gets there, and step 1 is where the drive is linked:
   🔗 Link my Google Drive opens the panel at its three steps (share the folder, paste its link), then shows what is linked. */
let STD = null, stdAsked = false;
async function loadStandard(){
  if(stdAsked) return; stdAsked = true;
  try{ STD = (await api({action:"standard"})).standard; }catch(e){ STD = {failed:true}; }
  redrawSlides();
  refreshBoxes();
}
/* The slide draws itself again, in place, whenever the drive's status changes (linked, built, checked, unlinked):
   every copy on the page, in the deck or the slides window, without the page being rendered again or the deck moving.
   A slide in the lesson frame is then fitted to it again, since its height may have changed. */
function redrawSlides(){
  const all = document.querySelectorAll("[data-drv-slide]");
  if(!all.length) return;
  const act = document.activeElement;
  if(act && act.matches && act.matches("[data-drv-link]")) linkHeld = true; else if(act && act !== document.body) linkHeld = false;
  const onSlide = !!document.querySelector("#lessonSlideWrap [data-drv-slide]");
  all.forEach(el=>{ el.outerHTML = slide(); });
  if(onSlide) fitSlide();
  // the keyboard stays in the slide: on the button once it works again, or on what follows it once the drive is linked
  if(linkHeld && (!document.activeElement || document.activeElement === document.body)){
    const b = ["[data-drv-link]:not(:disabled)", "[data-drv-build]", ".drv-s-open"].map(q=>document.querySelector("[data-drv-slide] " + q)).find(Boolean);
    if(b){ linkHeld = false; try{ b.focus({preventScroll:true}); }catch(e){} }
  }
}
function slide(){
  if(!STD) loadStandard();
  const mine = ownScreen();
  if(mine && !D) load();
  const me = mine && D && D.configured ? D : null, missing = me ? (me.lastMissing || []).length : 0;
  // not switched on for this site: the Worker says so to everybody ("standard"), and to a trainee in their own status
  const off = !!(STD && STD.configured === false) || (mine && !!D && !D.configured);
  const linked = !!(me && me.connected), linking = mine && connecting;
  const showErr = !off && !linked && mine && !!linkErr && !linking;
  // Step 1 is where the drive is linked: the button (a sample for anyone but a trainee on their own screen), then who is linked
  const linkBox = off ? "" : linked
    ? `<div class="drv-s-act"><span class="drv-s-ok">Linked${me.folderName || me.email ? `: <b>${esc(me.folderName || me.email)}</b>` : ""}</span>${/^https:\/\//.test(me.rootUrl || "") ? `<a class="drv-s-open" href="${esc(me.rootUrl)}" target="_blank" rel="noopener noreferrer">Open my Drive ↗</a>` : ""}</div>`
    : `<div class="drv-s-act"><button type="button" class="drv-s-link" data-drv-link onclick="CMDrive.link()" ${linking ? "disabled" : ""}><span class="drv-s-g">${GLOGO}</span>${linking ? "Linking…" : "🔗 Link my Google Drive"}</button></div>${showErr ? `<div class="drv-s-err" role="alert" title="${esc(linkErr)}"><span>⚠ ${esc(linkErr)}</span></div>` : ""}`;
  const build = linked && !me.built ? `<div class="drv-s-act"><button type="button" class="drv-s-link drv-s-build" data-drv-build onclick="CMDrive.show()">📂 Build my folders</button></div>` : "";
  const scope = "Make a folder in your Google Drive, share it with the platform as <b>Editor</b> and paste its link. The platform works in that folder only.";
  const steps = [
    ["Link your Google Drive", (off || linked ? "" : "Press the button here. ") + scope, linked, linkBox],
    ["Build the firm's folders by hand", "Every folder named, numbered, nested and in order, exactly to the standard. Submit it: it is graded folder by folder.", !!(me && me.built), build],
    ["✓ Check my drive", "Confirm every folder is still there. Put back anything missing.", !!(me && me.built && me.checkedAt && (!me.builtAt || me.checkedAt >= me.builtAt) && !missing), ""],
    ["File in the CMS, every day", "Each document you file lands in its folder on the drive too, under the name you filed it with.", !!(me && (me.saved || []).length), ""]
  ];
  const list = (STD && STD.standard) || [];
  // 🏷 the naming convention is a card in the empty corner beside the tree (the short rows at its foot), so it adds no
  // height to the slide; with no tree to sit beside, or in a narrow column, it goes under it
  const box = namingBox({day:1, slide:true, side:true});
  const tree = list.length
    ? `<div class="drv-s-std"><div class="drv-s-tw"><div class="drv-s-root">📁 <b>${esc(STD.root)}</b></div><ul class="drv-s-tree">${list.map(p=>{
        const depth = p.split("/").length - 1;
        return `<li style="padding-left:${depth * 22}px" title="${esc((STD.why || {})[p] || "")}">📁 <b>${esc(p.split("/").pop())}</b></li>`;
      }).join("")}</ul></div>${box}</div>`
    : `<p class="drv-s-note">${STD && STD.failed ? "The firm's structure couldn't be loaded. Open 📂 My Backup Drive to see it." : "Loading the firm's structure…"}</p>${box}`;
  return `<div class="drv-slide" data-drv-slide>
    <div class="drv-s-col"><div class="drv-s-top"><h3>📋 Your Task: The Case Backup</h3>${!off && mine ? `<button type="button" class="btn btn-navy btn-sm" onclick="CMDrive.show()">📂 Open My Backup Drive</button>` : ""}</div>
      <ol class="drv-s-steps${showErr ? " is-tight" : ""}">${steps.map(([h, t, done, extra], i)=>`<li class="${done ? "is-done" : ""}"><span class="drv-s-n">${done ? "✓" : i + 1}</span><div><b>${h}</b><span>${t}</span>${extra}</div></li>`).join("")}</ol>
      ${off ? `<p class="drv-s-note" data-drv-off>${mine ? offLine() : OFF_LINE}</p>` : ""}
      ${mine && fixLine() ? `<div class="drv-s-act drv-s-fix">${fixLine()}</div>` : ""}
    </div>
    <div class="drv-s-col"><h3>🗂 The Firm's Standard</h3>${tree}</div>
  </div>`;
}

/* ---------- 🏷 the firm's naming convention: the box, and the report of every name on the drive ----------
   Everything here is drawn from what the Worker says (the drive status for a trainee, "standard" for a presenter):
   the pattern, its parts, the Types, the labels, what a day's grade gives the names, and the last check of them. */
const E = esc;
const rule = ()=> (D && D.naming) || (STD && STD.naming) || null;
/* How many names are wrong, and in words. The Worker counts files and folders apart (wrongFiles, wrongFolders), and they
   are said apart: "6 files and 1 folder". A report from before it did has the one number: "7 names".
   `unscored` of them are listed for the trainee to rename and cost no points (the Worker's `unscored`: a copy the
   platform named itself, anything made before names were graded); `charged` is the rest, the ones a grade is lower for. */
function wrongOf(R){
  R = R || {};
  const apart = typeof R.wrongFiles === "number" || typeof R.wrongFolders === "number";
  const files = apart ? Math.max(0, Number(R.wrongFiles) || 0) : 0, folders = apart ? Math.max(0, Number(R.wrongFolders) || 0) : 0;
  const n = apart ? files + folders : Math.max(0, Number(R.wrong) || 0);
  const count = (k, word)=> k ? `${k} ${word}${k === 1 ? "" : "s"}` : "";
  const unscored = Math.min(n, Math.max(0, Number(R.unscored) || 0));
  return {n, files, folders, apart, unscored, charged: n - unscored, words: !n ? "" : apart ? [count(files, "file"), count(folders, "folder")].filter(Boolean).join(" and ") : count(n, "name")};
}
const wrongNames = ()=> wrongOf((rule() || {}).report).n;
/* ✗ N names to fix · 📂 Open My Backup Drive: where the trainee is working (a slide, the dashboard card). It opens the
   panel on the report of the names. Nothing for anyone but a trainee with names to fix. */
function fixLine(){
  const n = signedTrainee() ? wrongNames() : 0;
  return n ? `<button type="button" class="drv-nc-fix" data-drv-fix onclick="CMDrive.show('names')">✗ ${n} name${n === 1 ? "" : "s"} to fix · 📂 Open My Backup Drive</button>` : "";
}
/* 🏷 N names to fix ↓ in the panel: beside the folders' verdict and in its head, so a green "every folder is where it
   should be" is never the only thing said while names are wrong. */
function jumpToNames(cls){
  const W = wrongOf((rule() || {}).report);
  return W.n ? `<button type="button" class="drv-nm-jump${cls ? " " + cls : ""}" onclick="CMDrive.toNames()" title="Go to the list of names to fix">🏷 ${W.words} to fix ↓</button>` : "";
}
const today = ()=>{ const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const myCase = ()=> (window.CMCase && typeof CMCase.id === "function" && CMCase.id()) || (rule() || {}).caseId || "";
/* A name by the convention: the Worker's pattern, filled in. `category` is the CMS category (its Type comes from the
   Worker's own list); with no Case ID known it gives nothing, unless an example is asked for. */
function nameFor(o){
  const N = rule(); o = o || {};
  if(!N || !N.pattern) return "";
  const caseId = o.caseId || myCase() || (o.example ? N.exampleCase : ""), type = o.type || (N.types || {})[o.category] || "";
  if(!caseId || !type) return "";
  const ext = String(o.ext || "pdf").toLowerCase().replace(/[^a-z0-9]/g, "") || "pdf";
  return N.pattern.replace("<Case ID>", caseId).replace("<Last-First>", N.client).replace("<Type>", type).replace("<YYYY-MM-DD>", o.date || today()).replace("<ext>", ext);
}
/* The example: a document of that day's Backup File Maintenance, named as the trainee would file it today. */
const DAY_BLOCK = {1:"d1m1-drive", 2:"d2-drive", 3:"d3-drive", 4:"d4-drive", 5:"d5-drive"};
function exampleFor(day){
  const ids = (window.CM_CF_DOC_PACKETS || {})[DAY_BLOCK[day] || "d2-drive"] || [];
  const d = ids.map(id=> typeof cmDoc === "function" ? cmDoc(id) : null).find(Boolean) || null;
  const category = d && window.cmDocFiling && cmDocFiling.expectedCategory ? cmDocFiling.expectedCategory(d) : "Medical Records";
  const ext = d ? (/\.([A-Za-z0-9]{1,8})$/.exec(String(d.file || "")) || [])[1] : "pdf";
  return {title: d ? String(d.title || "") : "a medical record", name: nameFor({category, ext, example:true})};
}
/* What the names count for: the Worker's points, of the points it grades. It says each day's own total too (`ofDay`):
   on Day 5 it grades 48, the rubric's last row being the trainee's Case Notes, so there the names are 12 of 48. */
const weightOf = (day)=>{ const N = rule() || {}; return (N.ofDay && Number(N.ofDay[day])) || N.of; };
const weightLine = ()=>{ const N = rule(); if(!N || !N.points) return "";
  const other = Object.keys(N.ofDay || {}).sort().filter(d=>Number(N.ofDay[d]) && Number(N.ofDay[d]) !== Number(N.of));
  return `🏷 File names are <b>${N.points} of the ${N.of} points</b> the platform grades on each day's Backup File Maintenance${other.length ? ` (${other.map(d=>`of ${Number(N.ofDay[d])} on Day ${E(d)}`).join(", ")})` : ""}.`; };
/* The 🏷 box. `day` picks the example (0: the drive as a whole). Its forms (data-f, so it is redrawn in place as what it is
   when the rule, the Case ID or the count of names to fix arrives):
     ""        the panel: the pattern, the example, the parts, the labels, the weight and the scope;
     "c"       compact, on the dashboard card: the pattern, the example, the weight, and the names to fix;
     "s"       a lesson slide, one row so it costs the slide no size: the label, the pattern, 📋 Copy example and what the
               names count for; with names to fix, that line takes the place of the label and the points;
     "side"    Day 1's slide: a card in the empty corner beside the firm's standard (the label, the pattern, 📋 Copy example);
     "labels"  from Day 3, the labels that go last, in the Practice Lab line of the task slide (its row has the room). */
function namingBox(o){
  o = o || {};
  const day = Number(o.day) || 0, N = rule();
  const form = o.labels ? "labels" : o.side ? "side" : o.slide ? "s" : o.compact ? "c" : "";
  const attrs = `data-drv-naming="${day}" data-f="${form}"`;
  if(form === "labels"){
    const labs = N && day >= 3 ? (N.labels || []) : [];
    if(!N) want();
    return labs.length ? `<div class="drv-nc-lb" ${attrs}><strong>🏷 A label goes last:</strong>${labs.map(([word, add, what])=>`<code title="${E(what)}">…${E(add)}.pdf</code>`).join("")}</div>`
      : `<div class="drv-nc-lb" ${attrs} hidden></div>`;
  }
  const cls = `drv-nc${form === "c" ? " drv-nc-c" : ""}${form === "s" || form === "side" ? " drv-nc-s" : ""}${form === "side" ? " drv-nc-side" : ""}`;
  if(!N){
    // the rule comes with a trainee's own status; when that was refused or failed (or this isn't a trainee), from the
    // Worker's "standard", which anyone may read. Only when both are spent does the box say it couldn't be loaded.
    want();
    const spent = (!signedTrainee() || settled) && !!STD;
    return `<div class="${cls}" ${attrs}><div class="drv-nc-h">🏷 Naming convention</div><p class="drv-nc-w">${spent ? "The firm's naming convention couldn't be loaded. Open 📂 My Backup Drive to see it." : "Loading the firm's naming convention…"}</p></div>`;
  }
  const ex = exampleFor(day || 2), mine = !!myCase();
  // on a slide the pattern may break after an underscore (and before the extension), never inside a piece
  const pat = E(N.pattern).replace(/_/g, "_<wbr>").replace(/\.(&lt;[^.]*)$/, '<wbr><span class="drv-nc-x">.$1</span>');
  const copyEx = ex.name ? `<button type="button" class="drv-nc-copy" data-copy="${E(ex.name)}" title="${E(`Copies an example: ${ex.name} (${ex.title}, filed today)`)}" onclick="CMDrive.copy(this)">📋 Copy example</button>` : "";
  if(form === "side") return `<div class="${cls}" ${attrs}>
    <b class="drv-nc-h">🏷 Naming convention</b><code class="drv-nc-pat">${pat}</code>${copyEx}
  </div>`;
  if(form === "s"){
    const fix = fixLine();
    return `<div class="${cls}" ${attrs}><div class="drv-nc-r">
      ${fix ? `<b class="drv-nc-h" title="Naming convention">🏷</b>${fix}` : `<b class="drv-nc-h">🏷 Naming convention</b>`}<code class="drv-nc-pat">${pat}</code>${copyEx}
      ${!fix && day > 1 && N.points ? `<span class="drv-nc-pts" title="File names are ${N.points} of the ${weightOf(day)} points the platform grades on Day ${day}'s Backup File Maintenance">🏅 ${N.points} of the ${weightOf(day)} points</span>` : ""}
    </div></div>`;
  }
  const labels = (N.labels || []).map(([word, add, what])=>`<span><code>…${E(add)}.pdf</code> ${E(what)}</span>`).join("");
  return `<div class="${cls}" ${attrs}>
    <div class="drv-nc-h">🏷 Naming convention <span>every file on your Backup Drive</span></div>
    <code class="drv-nc-pat">${E(N.pattern)}</code>
    ${ex.name ? `<div class="drv-nc-ex"><span>Example${mine ? ", with your Case ID" : ""} · ${E(ex.title)}, filed today</span>
      <code>${E(ex.name)}</code><button type="button" class="drv-nc-copy" data-copy="${E(ex.name)}" onclick="CMDrive.copy(this)">📋 Copy</button></div>` : ""}
    ${form === "c" ? "" : `<ul class="drv-nc-parts">${(N.parts || []).map(([p, what])=>`<li><code>${E(p === "ext" ? ".<ext>" : `<${p}>`)}</code> ${E(what)}</li>`).join("")}</ul>`}
    ${(form !== "c" || day >= 3) && labels ? `<div class="drv-nc-lab"><b>A label is the last part:</b>${labels}</div>` : ""}
    <p class="drv-nc-w">${weightLine()}${form === "c" ? "" : " A copy keeps the name you filed it under in the CMS; rename a file in Google Drive only to add a label, or to fix a name this check reports."}</p>
    ${form === "c" && fixLine() ? `<div class="drv-nc-fixr">${fixLine()}</div>` : ""}
  </div>`;
}
/* The rule isn't here yet: it is asked for. A trainee's comes with their own status, asked once; when that has answered
   without one (refused: the Worker has no trainee tokens, or failed), or for anyone else, the Worker's "standard" is asked. */
function want(){
  if(signedTrainee() && !settled){ if(!asked) load(); }
  else if(!stdAsked) loadStandard();
}
function refreshBoxes(){
  const onSlide = !!document.querySelector("#lessonSlideWrap [data-drv-naming]");
  document.querySelectorAll("[data-drv-naming]").forEach(el=>{ const f = el.dataset.f || "";
    el.outerHTML = namingBox({day:Number(el.dataset.drvNaming) || 0, compact:f === "c", slide:f === "s" || f === "side", side:f === "side", labels:f === "labels"}); });
  // a box on a lesson slide has changed height: the slide is fitted to its frame again
  if(onSlide) fitSlide();
}
/* The lesson slide is fitted to its frame again. A typeface this slide is the first to use is still on its way when
   it is measured, and changes the heights when it lands: the slide is fitted once more then (no timer: the browser says when). */
let fontWait = false;
function fitSlide(){
  if(typeof window.paginateLessonSlide !== "function") return;
  try{ window.paginateLessonSlide(); }catch(e){}
  if(fontWait || !document.fonts || document.fonts.status !== "loading" || !document.fonts.ready) return;
  fontWait = true;
  document.fonts.ready.then(()=>{
    fontWait = false;
    if(document.querySelector("#lessonSlideWrap [data-drv-slide], #lessonSlideWrap [data-drv-naming]")){ try{ window.paginateLessonSlide(); }catch(e){} }
  }).catch(()=>{ fontWait = false; });
}
async function copy(btn){
  const text = (btn && btn.dataset && btn.dataset.copy) || "";
  if(!text) return;
  try{ await navigator.clipboard.writeText(text); }
  catch(e){ const t = document.createElement("textarea"); t.value = text; t.style.cssText = "position:fixed;left:-9999px;top:0"; document.body.appendChild(t); t.select(); try{ document.execCommand("copy"); }catch(x){} t.remove(); }
  const was = btn.textContent; btn.textContent = "✓ Copied"; setTimeout(()=>{ if(btn.isConnected) btn.textContent = was; }, 1400);
}
/* A name with the pieces that differ marked. `issues` is the Worker's list for that name ({n, part, got, should}): n is a
   piece's place between the underscores, part "ext" is the extension, "parts" (n 0) the name as a whole; an entry from
   before the Worker listed them has the one (n, part, got on the entry itself). `asIs`: the name as it stands (its `got`
   pieces); otherwise the name it should have (its `should` pieces). A piece one of them doesn't have isn't marked in it. */
function issuesOf(x){
  if(x && Array.isArray(x.issues)) return x.issues.filter(Boolean);
  return x && (x.n || x.part) ? [{n:x.n, part:x.part, got:x.got, should:x.should}] : [];
}
function markName(name, issues, cls, asIs){
  const s = String(name || ""), dot = s.lastIndexOf("."), hasExt = dot > 0 && dot < s.length - 1;
  const parts = (hasExt ? s.slice(0, dot) : s).split("_"), ext = hasExt ? s.slice(dot + 1) : "";
  const m = (t)=> `<mark class="${cls}">${E(t)}</mark>`;
  const hit = new Set(); let extHit = false, whole = false;
  (issues || []).forEach(i=>{
    const here = asIs ? i.got : i.should;   // the piece as this name has it: nothing to mark where the piece isn't in it
    if(i.part === "ext" || i.n === "ext"){ if(here == null || here !== "") extHit = true; }
    else if(i.part === "parts" || i.n === 0) whole = true;   // not a piece: the name as a whole (its pieces run together, or split)
    else if(i.part === "label" && here && parts.lastIndexOf(String(here)) >= 4) hit.add(parts.lastIndexOf(String(here)));   // the label is where it stands in this name (a counter the CMS put after the date may come before it in one name and not the other)
    else if(Number(i.n) >= 1 && (here == null || here !== "")) hit.add(Number(i.n) - 1);
  });
  if(whole) return m(s);
  return parts.map((p, i)=> hit.has(i) ? m(p) : E(p)).join("_") + (hasExt ? "." + (extHit ? m(ext) : E(ext)) : "");
}
/* One wrong name, as two lines: the name as it is and the name it should have, every differing piece marked in both.
   A folder's name is marked whole. The trainer's list (index.html) is drawn with the same marks. */
function nameLines(x){
  x = x || {};
  const folder = x.kind === "folder", iss = issuesOf(x), want = String(x.want || "");
  const all = (t, cls)=> `<mark class="${cls}">${E(t)}</mark>`;
  return {is: folder ? all(x.name, "drv-nr-bad") : markName(x.name, iss, "drv-nr-bad", true),
    want: !want ? "" : folder ? all(want, "drv-nr-good") : markName(want, iss, "drv-nr-good"),
    copy: want && !/[<>]/.test(want) ? want : ""};   // a name with a placeholder left in it is never offered to copy
}
/* The last check of the names, as the Worker reported it: each wrong one with its folder, the name as it is, the name
   it should have and every piece that differs; then what the check sees and what it can't. */
function namingReport(){
  const N = rule(), R = N && N.report;
  if(!N) return "";
  const scope = `<p class="drv-nr-see"><b>✓ What this check reads:</b> ${E(N.sees || "")}</p><p class="drv-nr-see drv-nr-blind"><b>⚠ What it can't see:</b> ${E(N.blind || "")}</p>`;
  if(!R) return `<div class="drv-nr" tabindex="-1"><div class="drv-nr-h">🏷 File names</div><p class="drv-nr-sub">Every name on your drive is read when you run ↻ Check my drive, and each time a document you file lands here.</p>${scope}</div>`;
  const all = R.checked || 0, W = wrongOf(R), bad = W.n, list = R.list || [];
  return `<div class="drv-nr" tabindex="-1">
    <div class="drv-nr-h">🏷 File names <span class="drv-score ${bad ? "is-low" : "is-pass"}">${bad ? `${W.words} to fix` : "all named the firm's way"}</span></div>
    <p class="drv-nr-sub">${all ? `${R.named} of ${all} file${all === 1 ? "" : "s"} named the firm's way` : "No file is on your drive yet"}${W.folders ? ` · ${W.folders} folder${W.folders === 1 ? "" : "s"} renamed` : ""}${W.unscored ? ` · ${W.unscored < bad ? `${W.unscored} of the ${bad} not counted in your grade` : bad === 1 ? "it is not counted in your grade" : `none of the ${bad} is counted in your grade`}` : ""}${R.at ? ` · checked ${E(new Date(R.at).toLocaleString())}` : ""}</p>
    ${list.map(x=>{ const L = nameLines(x), free = x.scored === false;
      return `<div class="drv-nr-it${free ? " is-free" : ""}">
      <div class="drv-nr-f">✗ ${x.kind === "folder" ? "Folder in" : "In"} <b>${E(x.folder)}</b>${free ? `<span class="drv-nr-free" title="The platform named this copy itself, before the convention was checked. Rename it to keep your drive in order: it does not lower your grade.">not counted in your grade</span>` : ""}</div>
      <div class="drv-nr-l"><span>Named</span><code>${L.is}</code></div>
      ${L.want ? `<div class="drv-nr-l"><span>Should be</span><code>${L.want}</code>${L.copy ? `<button type="button" class="drv-nc-copy" data-copy="${E(L.copy)}" onclick="CMDrive.copy(this)">📋 Copy</button>` : ""}</div>` : ""}
      ${x.hint ? `<div class="drv-nr-hint">👉 ${E(x.hint)}</div>` : ""}
    </div>`; }).join("")}
    ${bad > list.length ? `<p class="drv-nr-sub">…and ${bad - list.length} more.</p>` : ""}
    ${bad ? `<p class="drv-nr-sub">Rename each one in Google Drive (right-click → Rename), then run ↻ Check my drive again.</p>` : ""}
    ${scope}
  </div>`;
}

window.CMDrive = {card, slot, show, launch, close, retry(){ err = ""; settled = false; paint(); load(true); }, link, linkFolder, linkInput, disconnect, submit, check, rebuild, saveFiled, slide, grade, dayOpened,
  namingBox, namingReport, nameFor, copy, naming:rule, toNames, nameLines, wrongOf,
  name:setName, addSub, addTop, remove, move, status:()=>D, reload:()=>load(true)};

/* ---------- the panel's own look ---------- */
const css = document.createElement("style");
css.textContent = `
.drv-card{border:1px solid var(--line,#E3E6EF);border-radius:14px;padding:16px 18px;margin:0 0 16px;background:#fff;}
.drv-card.drv-todo{border-color:#EAD5B4;background:#FBF3E7;}
.drv-card.drv-warn{border-color:#F0CFCF;background:#FDF2F2;}
.drv-card.drv-ok{border-color:#CBE6CF;background:#F6FBF7;}
.drv-c-h{font-weight:800;color:var(--navy,#1B2240);font-size:16px;margin-bottom:5px;}
.drv-card .btn{font-size:14px;font-weight:800;margin:0 6px 6px 0;}
.drv-card p{font-size:14px;line-height:1.55;color:var(--ink,#1B1E2E);margin:0 0 12px;max-width:80ch;}
.drv-wrap{position:fixed;inset:0;z-index:4000;background:rgba(15,20,40,.55);display:flex;align-items:center;justify-content:center;padding:24px;}
.drv-cardw{width:min(800px,100%);max-height:100%;display:flex;flex-direction:column;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(10,15,35,.35);}
.drv-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px 12px;border-bottom:1px solid var(--line,#E3E6EF);}
.drv-head h3{margin:2px 0 0;font-size:18px;color:var(--navy,#1B2240);}
.drv-eyebrow{font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--orange-deep,#B9610F);}
.drv-x{border:0;background:none;font-size:17px;line-height:1;color:var(--ink-soft,#6E748C);cursor:pointer;padding:4px 6px;border-radius:6px;}
.drv-x:hover{background:#EEF0F6;}
.drv-body{padding:16px 20px;overflow:auto;}
.drv-p{font-size:13px;line-height:1.6;color:var(--ink,#1B1E2E);margin:0 0 14px;}
.drv-link-steps{margin:0 0 12px;padding-left:22px;font-size:14px;line-height:1.7;}
.drv-link-steps li{margin-bottom:4px;}
.drv-link-steps code.drv-sa{background:#F3F4F8;border-radius:5px;padding:1px 6px;font-weight:700;word-break:break-all;}
.drv-link-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.drv-link-row .drv-in{flex:1 1 260px;min-width:0;}
.drv-meta{font:700 14px/1.5 'Inter',sans-serif;color:#1E2340;margin:12px 0 0;}
.drv-tree{border:1px solid var(--line,#E3E6EF);border-radius:10px;padding:10px;background:#FAFBFE;}
.drv-tree.drv-read{background:#fff;}
.drv-row{display:flex;align-items:center;gap:6px;padding:3px 0;}
.drv-ic{font-size:13px;}
.drv-in{flex:1;min-width:120px;padding:6px 9px;border:1px solid var(--line,#E3E6EF);border-radius:7px;font:inherit;font-size:12.5px;}
.drv-nm{font-size:12.5px;color:var(--ink,#1B1E2E);}
.drv-row.is-gone .drv-nm{color:#8A2B2B;text-decoration:line-through;}
.drv-tag{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#8A2B2B;background:#FDF2F2;border:1px solid #F0CFCF;border-radius:999px;padding:1px 7px;}
.drv-tag.drv-tag-ok{color:#245B32;background:#F1F8F2;border-color:#CBE6CF;}
.drv-mini{border:1px solid var(--line,#E3E6EF);background:#fff;border-radius:6px;font:inherit;font-size:11px;padding:3px 6px;cursor:pointer;color:var(--navy,#1B2240);}
.drv-mini:hover{border-color:var(--orange,#DB8437);}
.drv-mini.drv-add{margin-top:10px;font-weight:800;padding:6px 10px;}
.drv-good{margin-top:12px;font-size:12.5px;line-height:1.55;background:#F1F8F2;border:1px solid #CBE6CF;color:#245B32;border-radius:9px;padding:9px 11px;}
.drv-bad{margin-top:12px;font-size:12.5px;line-height:1.55;background:#FDF2F2;border:1px solid #F0CFCF;color:#8A2B2B;border-radius:9px;padding:9px 11px;}
.drv-bad ul{margin:6px 0 0;padding-left:18px;} .drv-bad li{margin-bottom:4px;}
.drv-verdict{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px 10px;margin-top:12px;}
.drv-verdict:empty{display:none;}
.drv-verdict > .drv-good,.drv-verdict > .drv-bad{margin-top:0;flex:1 1 280px;}
.drv-nm-jump{border:2px solid #C0392B;background:#FDF2F2;color:#8A2B2B;border-radius:9px;padding:7px 12px;font:800 14px/1.4 'Inter',sans-serif;cursor:pointer;white-space:nowrap;}
.drv-nm-jump:hover,.drv-nm-jump:focus-visible{background:#C0392B;color:#fff;outline:none;}
.drv-nm-jump.drv-nm-top{margin-left:auto;align-self:center;padding:4px 10px;white-space:normal;text-align:left;}
body:has(#cmDriveHost) #toast{z-index:4100;}   /* what is said while the panel is open (names to fix, after ✓ Check my drive) is said over it, not behind it */
.drv-foot{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:12px 20px;border-top:1px solid var(--line,#E3E6EF);background:#F8F9FC;}
.drv-btn{border:1px solid var(--line,#E3E6EF);background:#fff;color:var(--navy,#1B2240);border-radius:8px;padding:7px 12px;font:inherit;font-size:12px;font-weight:800;cursor:pointer;text-decoration:none;}
.drv-btn:hover:not(:disabled){border-color:var(--orange,#DB8437);}
.drv-btn:disabled{opacity:.6;cursor:default;}
.drv-btn.drv-go{background:var(--navy,#1B2240);border-color:var(--navy,#1B2240);color:#fff;}
.drv-grades{margin-top:14px;border:1px solid var(--line,#E3E6EF);border-radius:10px;padding:10px 12px;background:#FAFBFE;}
.drv-g-h{font-weight:800;color:var(--navy,#1B2240);font-size:14px;margin-bottom:6px;}
.drv-g-row{padding:6px 0;border-top:1px dashed var(--line,#E3E6EF);font:700 14px/1.45 'Inter',sans-serif;color:#1E2340;}
.drv-g-row:first-of-type{border-top:0;}
.drv-g-row b{color:var(--navy,#1B2240);font-weight:800;} .drv-g-row small{display:block;font:700 14px/1.45 'Inter',sans-serif;color:#4A5268;margin-top:2px;}
.drv-g-row ul{margin:4px 0 0;padding-left:18px;color:#8A2B2B;} .drv-g-row li{margin-bottom:2px;}
.drv-score{float:right;font-weight:800;border-radius:999px;padding:1px 9px;font-size:14px;}
.drv-score.is-pass{background:#F1F8F2;color:#245B32;border:1px solid #CBE6CF;} .drv-score.is-low{background:#FDF2F2;color:#8A2B2B;border:1px solid #F0CFCF;}
.drv-slide{display:grid;grid-template-columns:minmax(0,1.04fr) minmax(0,1fr);gap:18px;}
.drv-slide,.drv-slide *{text-align:left!important;}
.drv-slide li::before,.drv-slide li::marker{content:none!important;display:none!important;}
.drv-s-col{background:#fff;border:1px solid #DDE1EA;border-radius:14px;padding:12px 18px 10px;color:#141A2E;}
.drv-s-col h3{margin:0 0 8px;font:800 clamp(21px,2.8vh,27px) 'Poppins','Inter',sans-serif;color:#1E2340;}
.drv-s-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;}
.drv-s-steps.is-tight{gap:6px;} .drv-s-steps.is-tight li > div > span{line-height:1.4;}   /* a sign-in that didn't finish adds its line to step 1: the steps close up for it, so the slide is never scaled down */
.drv-s-steps li{display:flex;gap:12px;align-items:flex-start;margin:0;padding:0;}
.drv-s-n{flex:0 0 clamp(32px,4.6vh,40px);height:clamp(32px,4.6vh,40px);border-radius:50%;background:#1E2340;color:#F6C08F;display:flex;align-items:center;justify-content:center;font:800 19px 'Inter',sans-serif;}
.drv-s-steps li.is-done .drv-s-n{background:#1E8E4F;color:#fff;}
.drv-s-steps li > div > b{display:block;font:800 clamp(19px,2.55vh,25px) 'Inter',sans-serif;color:#1E2340;}
.drv-s-steps span b{font-weight:800;color:#1E2340;}
.drv-s-steps li > div > span{display:block;font:700 clamp(17px,2.2vh,21px)/1.4 'Inter',sans-serif;}
.drv-s-act{display:flex;align-items:center;gap:4px 14px;flex-wrap:wrap;margin-top:5px;}
.drv-s-link{display:inline-flex;align-items:center;gap:8px;border:2px solid #1E2340;background:#1E2340;color:#fff;border-radius:10px;padding:5px 18px 5px 8px;font:800 clamp(17px,2.3vh,22px)/1.3 'Inter',sans-serif;cursor:pointer;box-shadow:0 3px 0 #DB8437;margin-bottom:3px;}
.drv-s-link:hover:not(:disabled){background:#DB8437;border-color:#DB8437;color:#1E2340;box-shadow:0 3px 0 #1E2340;}
.drv-s-link:focus-visible,.drv-s-open:focus-visible{outline:3px solid #DB8437;outline-offset:3px;}
.drv-s-link:disabled{opacity:.7;cursor:default;}
.drv-s-g{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:#fff;}
.drv-s-g svg{width:16px;height:16px;margin:0!important;vertical-align:0!important;display:block;}
.drv-s-link.drv-s-build{background:#fff;color:#1E2340;padding:4px 16px;}
.drv-s-ok{font:800 16px/1.4 'Inter',sans-serif;color:#1E8E4F;overflow-wrap:anywhere;}
.drv-s-open{font:800 16px/1.4 'Inter',sans-serif;color:#1E2340;text-decoration:underline;text-decoration-color:#DB8437;text-decoration-thickness:2px;text-underline-offset:3px;white-space:nowrap;}
.drv-s-open:hover{color:#B9610F;}
.drv-s-err{margin-top:6px;padding:4px 12px;border-left:4px solid #DB8437;border-radius:6px;background:#FFF8F0;color:#1E2340;font:700 16px/1.4 'Inter',sans-serif;}
.drv-s-err > span{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;}   /* two lines at the most (all of it is in the toast, and on hover) */
.aud-hint.drv-aud-say{top:18px;bottom:auto;max-width:calc(100vw - 40px);background:#1E2340;border:2px solid #DB8437;color:#fff;border-radius:12px;padding:8px 18px;font:700 16px/1.4 'Inter',sans-serif;text-align:center;z-index:30;cursor:pointer;animation:drvAudSay 4.5s ease forwards;animation-duration:4.5s!important;}   /* a fade, kept where motion is reduced: the line has to stay long enough to be read */
@keyframes drvAudSay{0%{opacity:0;}6%{opacity:1;}85%{opacity:1;}100%{opacity:0;}}
.drv-s-root{padding:6px 10px;border-radius:10px;background:#1E2340;color:#fff;font:700 16px 'Inter',sans-serif;}
.drv-slide .drv-s-tree{list-style:none;margin:6px 0 0 10px!important;width:auto!important;max-width:none!important;padding:0 0 0 12px;border-left:3px solid #DB8437;font:700 16px/1.25 'Inter',sans-serif;}
.drv-s-tree li{margin:0!important;padding-top:1px;padding-bottom:1px;display:block;}
.drv-slide .drv-s-tree li{font-size:16px;line-height:1.3;color:#1E2340;}
.drv-s-tree b{color:#1E2340;}
.drv-s-note{margin:10px 0 0;padding:8px 12px;border-left:4px solid #DB8437;background:#FFF8F0;font:700 16px/1.45 'Inter',sans-serif;}
.drv-nc{margin:12px 0;border:2px solid #1E2340;border-left:8px solid #DB8437;border-radius:12px;padding:10px 14px;background:#FFF8F0;color:#1E2340;font:700 14px/1.45 'Inter',sans-serif;text-align:left;}
.drv-nc-h{font:800 16px 'Poppins','Inter',sans-serif;color:#1E2340;margin-bottom:6px;}
.drv-nc-h span{font:700 14px 'Inter',sans-serif;color:#B9610F;margin-left:6px;}
.drv-nc code{font:700 14px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#1E2340;overflow-wrap:anywhere;}
.drv-nc-pat{display:block;background:#1E2340;color:#fff!important;border-radius:8px;padding:7px 10px;font-size:15px!important;}
.drv-nc-ex{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;}
.drv-nc-ex > span{flex:1 1 100%;font:700 14px 'Inter',sans-serif;color:#1E2340;}
.drv-nc-ex code{background:#fff;border:1.5px solid #DB8437;border-radius:8px;padding:5px 9px;}
.drv-nc-copy{border:1.5px solid #1E2340;background:#fff;color:#1E2340;border-radius:8px;padding:4px 10px;font:800 14px 'Inter',sans-serif;cursor:pointer;white-space:nowrap;}
.drv-nc-copy:hover{background:#1E2340;color:#fff;}
.drv-nc-parts{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:3px;}
.drv-nc-parts li{font:700 14px/1.4 'Inter',sans-serif;color:#1E2340;}
.drv-nc-parts code{display:inline-block;min-width:118px;color:#B9610F;}
.drv-nc-lab{margin-top:8px;display:grid;gap:3px;font:700 14px/1.4 'Inter',sans-serif;}
.drv-nc-lab span{display:block;}
.drv-nc-lab code{color:#B9610F;}
.drv-nc-w{margin:8px 0 0!important;font:700 14px/1.45 'Inter',sans-serif!important;color:#1E2340!important;max-width:none!important;}
.drv-nc-w b{color:#B9610F;}
.drv-nc.drv-nc-c{padding:8px 12px;}
.drv-nc.drv-nc-c .drv-nc-ex > span{flex:0 1 auto;}
.drv-nc.drv-nc-s{margin:8px 0 0;padding:4px 12px;font:700 16px/1.3 'Inter',sans-serif;}
.drv-nc-s .drv-nc-r{display:flex;align-items:center;gap:6px 12px;flex-wrap:wrap;}
.drv-nc-s .drv-nc-h{font:800 18px 'Poppins','Inter',sans-serif;margin:0;white-space:nowrap;}
.drv-nc-s code{font-size:16px;}
.drv-nc-s .drv-nc-pat{display:inline-block;font-size:16px!important;padding:4px 10px;}
.drv-nc-s .drv-nc-copy{font-size:16px;padding:3px 10px;}
.drv-nc-pts{margin-left:auto;background:#1E2340;color:#F6C08F!important;border-radius:999px;padding:3px 12px;font:800 16px 'Inter',sans-serif!important;white-space:nowrap;}
.drv-nc-fix{border:2px solid #C0392B;background:#C0392B;color:#fff;border-radius:8px;padding:3px 12px;font:800 16px/1.3 'Inter',sans-serif;cursor:pointer;text-align:left;}
.drv-nc-fix:hover,.drv-nc-fix:focus-visible{background:#fff;color:#8A2B2B;outline:none;}
.drv-nc-fixr{margin-top:8px;} .drv-nc-c .drv-nc-fix{font-size:14px;}
.drv-s-act.drv-s-fix{margin-top:10px;}
.drv-s-std{display:grid;grid-template-columns:minmax(0,1fr);container-type:inline-size;}
.drv-s-tw{grid-area:1/1;min-width:0;}
.drv-slide .drv-nc.drv-nc-side{grid-area:1/1;justify-self:end;align-self:end;box-sizing:border-box;width:290px;width:clamp(250px,calc(100cqw - 267px),290px);max-width:100%;margin:0;padding:8px 10px;border-left-width:6px;display:flex;flex-direction:column;align-items:flex-start;gap:6px;}   /* beside the tree's short rows (the last eight end within 255px): what is left of the column, the pattern on two lines or three */
.drv-nc-side .drv-nc-pat{display:block;padding:5px 8px;} .drv-nc-x{white-space:nowrap;}
.drv-s-col > .drv-nc.drv-nc-side{margin-top:10px;}
@container (max-width:516px){ .drv-slide .drv-nc.drv-nc-side{grid-area:2/1;justify-self:stretch;width:auto;margin-top:8px;} }   /* a column too narrow for both: the card goes under the tree */
.cfx .cfx-task.cfx-drv{grid-template-columns:minmax(0,1.34fr) minmax(0,.86fr);}
.cfx .cfx-drv .cfx-at{font-size:16px!important;font-weight:700;line-height:1.45;padding:0 6px;}   /* a Backup File Maintenance task (.cfx-drv, js/cm-case-flow.js): with the naming row on one line the slide has room, so its small type reads at 16px bold like the rest */
.cfx .cfx-do-now.cfx-drv span,.cfx .cfx-do-now.cfx-drv span em{font-weight:600!important;}
.cfx .cfx-drv .cfx-side .cfx-why b,.cfx .cfx-drv .cfx-docs summary,.cfx .cfx-drv .cfx-docs summary b,.cfx .cfx-drv .cfx-deliver b,.cfx .cfx-drv .cfx-deliver em{font-size:16px!important;}
.cfx .cfx-drv .cfx-side button.cfx-deliver{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px 10px;}   /* 📤 Deliver and its Hand in ➔ share the card's first line: the height that saves is what the 16px labels take */
.cfx .cfx-drv .cfx-side button.cfx-deliver em{grid-area:1/2;align-self:center;}
.cfx .cfx-drv .cfx-side button.cfx-deliver span{grid-area:2/1/3/3;}
.cfx-do-now .drv-nc-lb{margin-left:auto;display:flex;align-items:baseline;gap:4px 10px;flex-wrap:wrap;}
.drv-nc-lb[hidden]{display:none!important;}
.drv-nc-lb strong{font:800 16px/1.4 'Inter',sans-serif;color:#1E2340;}
.drv-nc-lb code{font:700 16px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#B9610F;background:#fff;border:1.5px solid #DB8437;border-radius:8px;padding:0 8px;white-space:nowrap;}
.drv-s-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}
.drv-s-top h3{margin:0;}
.drv-nr{margin-top:14px;border:2px solid #1E2340;border-radius:12px;padding:10px 14px;background:#fff;color:#1E2340;font:700 14px/1.45 'Inter',sans-serif;}
.drv-nr-h{font:800 16px 'Poppins','Inter',sans-serif;color:#1E2340;}
.drv-nr-h .drv-score{font-size:14px;}
.drv-nr-sub{margin:4px 0 0;font:700 14px/1.45 'Inter',sans-serif;color:#1E2340;}
.drv-nr-it{margin-top:10px;border:1.5px solid #F0CFCF;border-left:6px solid #C0392B;border-radius:10px;padding:8px 10px;background:#FFFAFA;}
.drv-nr-f{font:800 14px 'Inter',sans-serif;color:#8A2B2B;margin-bottom:4px;}
.drv-nr-f b{color:#1E2340;}
.drv-nr-l{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;}
.drv-nr-l > span{flex:0 0 78px;font:800 14px 'Inter',sans-serif;color:#1E2340;}
.drv-nr-l code{flex:1 1 300px;font:700 14px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#1E2340;overflow-wrap:anywhere;}
.drv-nr-bad{background:#FBD9D3;color:#8A2B2B;border-radius:4px;padding:0 2px;text-decoration:underline wavy #C0392B;text-underline-offset:3px;}
.drv-nr-good{background:#D8F0DE;color:#17603A;border-radius:4px;padding:0 2px;}
.drv-nr:focus{outline:none;} .drv-nr:focus-visible{outline:3px solid #DB8437;outline-offset:2px;}
.drv-nr-it.is-free{border-color:#DDE1EA;border-left-color:#8A93A8;background:#FAFBFE;}
.drv-nr-it.is-free .drv-nr-f{color:#4A5268;}
.drv-nr-free{margin-left:8px;font:700 14px 'Inter',sans-serif;color:#4A5268;background:#EEF0F6;border:1px solid #DDE1EA;border-radius:999px;padding:1px 9px;white-space:nowrap;}
.drv-nr-hint{margin-top:6px;font:700 14px/1.45 'Inter',sans-serif;color:#1E2340;background:#FFF8F0;border-left:4px solid #DB8437;border-radius:6px;padding:5px 9px;}
.drv-nr-see{margin:10px 0 0;font:700 14px/1.45 'Inter',sans-serif;color:#1E2340;}
.drv-nr-see b{font-weight:800;}
.drv-nr-blind{margin-top:4px;background:#FFF8F0;border-left:4px solid #DB8437;border-radius:6px;padding:5px 9px;}
@media (max-width:860px){ .drv-slide{grid-template-columns:1fr;} }
@media (max-width:760px){ .drv-wrap{padding:0;} .drv-cardw{width:100%;height:100%;border-radius:0;} }`;
document.head.appendChild(css);

document.addEventListener("keydown", (e)=>{ if(e.key === "Escape" && open) close(); });
window.addEventListener("load", ()=>{ setTimeout(()=>load(), 500); });
})();
