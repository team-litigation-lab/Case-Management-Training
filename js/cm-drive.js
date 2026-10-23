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
     1. Connects their own Google account once. drive.file only: the platform can see and change the
        folders and files it makes and nothing else in their Drive.
     2. Lays the firm's structure out themselves — adds each folder, names it, nests it, puts it in order.
        Nothing is prefilled: the structure is the thing being learned, so it is typed, not accepted.
     3. Submits it, and the Worker grades it against the firm's standard (FOLDER_STANDARD in worker.js,
        the one place it is written down) folder by folder, each problem with the rule behind that folder.
        A layout that is right is then made in their Drive exactly as they laid it out.
     4. Keeps it. ↻ Check my drive asks Google whether every folder is still there and names any somebody
        deleted; 🔁 Put the missing folders back makes them again.

   The server side is /api/drive in worker.js (every action, the grading and the Google tokens, which are
   sealed and never leave it). This file is the page: the dashboard card, the setup panel and the Drive
   copy of a filed document. Until GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set on the Worker, the
   card stays away and nothing else is blocked.
   ============================================================ */
(function(){
const esc = (s)=> String(s == null ? "" : s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const say = (m)=> { if(typeof toast === "function") toast(m); };
const GLOGO = '<svg width="13" height="13" viewBox="0 0 87.3 78" aria-hidden="true" style="vertical-align:-2px;margin-right:5px"><path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/><path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"/><path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/><path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/><path fill="#2684fc" d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/><path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/></svg>';

let D = null;                  // the drive, as the Worker reports it
let asked = false, busy = false, connecting = false, err = "", open = false;
let graded = null, verified = null;
let tree = null;               // the layout the trainee is building: [{name, children:[…]}]
let gisLoading = false, gisFailed = false;

const signedTrainee = ()=> typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;

/* ---------- the server ---------- */
async function api(body){
  const r = await fetch("/api/drive", {method:"POST", headers:Object.assign({"Content-Type":"application/json"}, typeof authHeaders === "function" ? authHeaders() : {}), body:JSON.stringify(body || {action:"status"})});
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
    if(e.code === "DRIVE_NOT_A_TRAINEE"){ D = {configured:false}; }
    else err = e.message;
  }
  paint(); fillSlot();
}
function fillSlot(){
  const slot = document.getElementById("drvCardSlot");
  if(slot && !open) slot.innerHTML = card();
}

/* ---------- the dashboard card: Day 1's first job, then a status line ---------- */
function card(){
  if(!signedTrainee()) return "";
  if(!D){ load(); return ""; }
  if(!D.configured) return "";                     // not switched on for this site: say nothing
  const n = (D.standard || []).length;
  if(!D.built) return `<div class="drv-card drv-todo">
    <div class="drv-c-h">📂 Day 1 · Set up your Backup Drive</div>
    <p>Every document you file in the CMS is also kept on the firm's backup drive, in the same case file you work from here — intake, records, bills, liens, litigation. Before Day 1's first block, connect your own Google Drive and lay the firm's ${n}-folder structure out in it yourself. It is graded, and it is where your work goes for the rest of the programme.</p>
    ${steps()}
    <button type="button" class="btn btn-navy btn-sm" onclick="CMDrive.show()">📂 Set up my Backup Drive</button>
  </div>`;
  const missing = (D.lastMissing || []).length;
  return `<div class="drv-card ${missing ? "drv-warn" : "drv-ok"}">
    <div class="drv-c-h">📂 Backup Drive ${missing ? `· ${missing} folder${missing === 1 ? "" : "s"} missing` : "· in order"}</div>
    <p>${missing ? `${missing} of the firm's folders ${missing === 1 ? "is" : "are"} no longer in your Drive. A document filed into a folder that isn't there is a document the firm has lost.`
      : `The firm's ${n} folders are in your Drive${D.email ? ` (${esc(D.email)})` : ""}${(D.saved || []).length ? `, holding ${(D.saved || []).length} filed document${(D.saved || []).length === 1 ? "" : "s"}` : ""}.`}</p>
    ${steps()}
    <button type="button" class="btn ${missing ? "btn-navy" : "btn-ghost"} btn-sm" onclick="CMDrive.show()">📂 Open my Backup Drive</button>
  </div>`;
}
/* The job in three steps, each ticked when done. Your trainer sees the same three in the Trainee Audit. */
function steps(){
  const saved = (D.saved || []).length, missing = (D.lastMissing || []).length;
  const li = (done, text)=>`<li style="${done ? "color:var(--success);" : ""}">${done ? "✓" : "○"} ${text}</li>`;
  return `<ol class="drv-steps" style="list-style:none;margin:6px 0 10px;padding:0;font-size:12.5px;line-height:1.7;">
    ${li(!!D.connected, "Connect your Google Drive")}
    ${li(!!D.built && !missing, "Build the firm's folders" + (missing ? ` — ${missing} missing, put them back` : ""))}
    ${li(saved > 0, "Keep every document you file backed up in its folder" + (saved ? ` (${saved} so far)` : ""))}
  </ol>`;
}
/* The dashboard asks for the card through its own slot, so it can be redrawn on its own later without
   redrawing (and re-routing) the whole page. */
function slot(){ return `<div id="drvCardSlot">${card()}</div>`; }

/* ---------- the panel ---------- */
function show(){ open = true; if(!D) load(); if(!tree) tree = [{name:"", children:[]}]; paint(); }
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

function paint(){
  let host = document.getElementById("cmDriveHost");
  if(!open){ if(host) host.remove(); return; }
  if(!host){ host = document.createElement("div"); host.id = "cmDriveHost"; document.body.appendChild(host); }
  const n = D ? (D.standard || []).length : 0;
  let body;
  if(!D) body = `<p class="drv-p">Checking your Backup Drive…</p>`;
  else if(!D.configured) body = `<p class="drv-p">The Backup Drive isn't switched on for this site yet — a trainer sets it up once (README → 📂 The trainee's Backup Drive). Nothing else in the programme is blocked.</p>`;
  else if(!D.connected){
    preloadGis();
    body = `<p class="drv-p">Connect the Google account you want to practise on — a personal Gmail address is fine. The platform asks Google for <b>drive.file</b> only: it can see and change the folders and files it makes here, and nothing else in your Drive. Everything it makes stays yours, and you can disconnect at any time.</p>
      <button type="button" class="drv-btn drv-go" onclick="CMDrive.connect()" ${connecting ? "disabled" : ""}>${GLOGO}${connecting ? "Connecting…" : "Connect my Google Drive"}</button>`;
  } else if(!D.built){
    body = `<p class="drv-p">Lay the firm's structure out as you would build it in a real practice: ${n} folders, named and nested and in order. It is the case file you already work from here — intake and retainer, the police report, records apart from bills, liens, wages and costs, property damage, litigation — plus the firm's own folders. Nothing is filled in for you. Press <b>Check and build it in my Drive</b> when it is how you would hand it to a colleague.</p>
      <div class="drv-tree">${rowsHTML(tree, "", 0)}</div>
      <button type="button" class="drv-mini drv-add" onclick="CMDrive.addTop()">➕ Add a top-level folder</button>
      ${graded ? (graded.ok
        ? `<div class="drv-good"><b>Right${(D.setup && D.setup.attempts > 1) ? ` — on attempt ${D.setup.attempts}` : " first time"}.</b> The structure is in your Drive now.</div>`
        : `<div class="drv-bad"><b>Not built yet — ${graded.score}% of the structure is right.</b><ul>${graded.problems.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`) : ""}`;
  } else {
    const missing = (verified ? verified.missing : D.lastMissing) || [];
    const saved = D.saved || [];
    body = `<p class="drv-p">The firm's ${n} folders are in your Drive${D.email ? `, on ${esc(D.email)}` : ""}. Keeping them there is part of the job: every document you file in the CMS is also saved into its folder here.</p>
      <div class="drv-tree drv-read">${(D.standard || []).map(p=>{
        const depth = p.split("/").length - 1, name = p.split("/").pop(), gone = missing.includes(p);
        const held = saved.filter(s=>s.folder === p).length;
        return `<div class="drv-row drv-static ${gone ? "is-gone" : ""}" style="margin-left:${depth * 20}px" title="${esc((D.why || {})[p] || "")}">
          <span class="drv-ic">${gone ? "⚠" : "📁"}</span><span class="drv-nm">${esc(name)}</span>
          ${gone ? `<span class="drv-tag">missing from your Drive</span>` : ""}
          ${held ? `<span class="drv-tag drv-tag-ok">${held} document${held === 1 ? "" : "s"}</span>` : ""}
        </div>`;
      }).join("")}</div>
      ${missing.length ? `<div class="drv-bad"><b>${missing.length} folder${missing.length === 1 ? " is" : "s are"} no longer in your Drive.</b> A document filed into a folder that isn't there is a document the firm has lost.</div>`
        : verified ? `<div class="drv-good"><b>Every folder is where it should be.</b> Checked just now.</div>` : ""}
      ${D.setup ? `<p class="drv-meta">Day 1 setup: ${D.setup.score}% on ${D.setup.attempts} attempt${D.setup.attempts === 1 ? "" : "s"}${D.setup.at ? `, ${new Date(D.setup.at).toLocaleDateString()}` : ""}.</p>` : ""}`;
  }
  const foot = !D || !D.configured || !D.connected ? "" :
    !D.built ? `<button type="button" class="drv-btn drv-go" onclick="CMDrive.submit()" ${busy ? "disabled" : ""}>${busy ? "Checking…" : "Check and build it in my Drive"}</button>
                <button type="button" class="drv-btn" onclick="CMDrive.disconnect()">Disconnect</button>`
    : `<button type="button" class="drv-btn" onclick="CMDrive.check()" ${busy ? "disabled" : ""}>${busy ? "Checking…" : "↻ Check my drive"}</button>
       ${((verified ? verified.missing : D.lastMissing) || []).length ? `<button type="button" class="drv-btn drv-go" onclick="CMDrive.rebuild()" ${busy ? "disabled" : ""}>🔁 Put the missing folders back</button>` : ""}
       ${D.rootUrl ? `<a class="drv-btn" href="${esc(D.rootUrl)}" target="_blank" rel="noopener noreferrer">Open in Drive ↗</a>` : ""}
       <button type="button" class="drv-btn" onclick="CMDrive.disconnect()">Disconnect</button>`;

  host.innerHTML = `<div class="drv-wrap" role="dialog" aria-modal="true" aria-label="My Backup Drive">
    <div class="drv-cardw">
      <div class="drv-head">
        <div><div class="drv-eyebrow">Day 1 · File management</div><h3>📂 My Backup Drive</h3></div>
        <button type="button" class="drv-x" onclick="CMDrive.close()" aria-label="Close">✕</button>
      </div>
      <div class="drv-body">${body}${err ? `<div class="drv-bad">${esc(err)}</div>` : ""}</div>
      <div class="drv-foot">${foot}</div>
    </div></div>`;
}

/* ---------- Google sign-in (the popup code flow, as the CMS's Drive backup uses) ---------- */
function preloadGis(){
  if(gisLoading || gisFailed || (window.google && google.accounts && google.accounts.oauth2)) return;
  gisLoading = true;
  const sc = document.createElement("script");
  sc.src = "https://accounts.google.com/gsi/client"; sc.async = true;
  sc.onload = ()=>{ gisLoading = false; };
  sc.onerror = ()=>{ gisLoading = false; gisFailed = true; err = "Google sign-in couldn't load. Check that accounts.google.com isn't blocked, then try again."; paint(); };
  document.head.appendChild(sc);
}
function connect(){
  const oauth = window.google && google.accounts && google.accounts.oauth2;
  if(!D || !D.configured) return;
  if(!oauth){ preloadGis(); say(gisFailed ? "Google sign-in couldn't load." : "Google sign-in is still loading — press Connect again in a moment."); return; }
  oauth.initCodeClient({
    client_id: D.clientId, scope: D.scopes, ux_mode: "popup", select_account: true,
    callback: async (resp)=>{
      if(!resp || resp.error || !resp.code){ say(resp && resp.error === "access_denied" ? "Google access wasn't allowed." : "Google sign-in didn't finish."); return; }
      connecting = true; err = ""; paint();
      try{ D = (await api({action:"connect", code:resp.code})).drive; tree = [{name:"", children:[]}]; say(`Google Drive connected${D.email ? ` (${D.email})` : ""}.`); }
      catch(e){ err = e.message; say(e.message); }
      connecting = false; paint();
    },
    error_callback: (e)=>{
      const t = e && e.type;
      say(t === "popup_closed" ? "Google sign-in was closed before it finished."
        : t === "popup_failed_to_open" ? "The browser blocked the Google sign-in window. Allow pop-ups for this site and try again."
        : "Google sign-in failed.");
    }
  }).requestCode();
}
async function disconnect(){
  if(!D || !D.connected || busy) return;
  if(!confirm("Disconnect Google Drive? The folders and files already in your Drive stay there, and your Day 1 grade is kept.")) return;
  busy = true; paint();
  try{ D = (await api({action:"disconnect"})).drive; verified = null; graded = null; err = ""; say("Google Drive disconnected."); }
  catch(e){ err = e.message; }
  busy = false; paint();
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
    try{ if(typeof storeSet === "function") await storeSet("drive-setup", {score:graded.score, ok:graded.ok, attempts:(D.setup && D.setup.attempts) || 1, at:new Date().toISOString(), left:graded.problems.length}); }catch(e){}
    if(graded.ok) say("Your Backup Drive is built — the structure is in your Drive.");
    else say(`${graded.problems.length} thing${graded.problems.length === 1 ? "" : "s"} to fix before it is built.`);
    fillSlot();
  }catch(e){ err = e.message; }
  busy = false; paint();
}
async function check(){
  if(busy) return;
  busy = true; err = ""; paint();
  try{ const out = await api({action:"check"}); verified = out.verified; D = out.drive; }
  catch(e){ err = e.message; }
  busy = false; paint(); fillSlot();
}
async function rebuild(){
  if(busy) return;
  busy = true; err = ""; paint();
  try{ const out = await api({action:"rebuild"}); D = out.drive; verified = {missing:[]}; say("The missing folders are back in your Drive."); }
  catch(e){ err = e.message; }
  busy = false; paint(); fillSlot();
}

/* ---------- a document filed in the CMS, kept on the backup drive too ----------
   Called by js/cm-doc-filing.js once the CMS has accepted a document: same bytes, same name, into the
   folder the firm keeps that kind of document in. The document's own folder id (CM_CF_DOC_FOLDERS) picks
   it, so nothing here guesses. The CMS is the file of record, so a drive that isn't connected or set up,
   or anything at all going wrong here, never undoes the filing. */
async function saveFiled(docFolder, name, bytes){
  if(!D || !D.configured || !D.connected || !D.built) return {ok:false, why:"no-drive"};
  const folder = (D.homes || {})[docFolder];
  if(!folder) return {ok:false, why:"no-folder"};
  try{
    const b = new Uint8Array(bytes);
    let s = ""; for(let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
    const b64 = btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const out = await api({action:"put", docFolder, name, mime:"application/pdf", b64});
    D = out.drive;
    return {ok:true, folder};
  }catch(e){ return {ok:false, why:e.message}; }
}

window.CMDrive = {card, slot, show, close, connect, disconnect, submit, check, rebuild, saveFiled,
  name:setName, addSub, addTop, remove, move, status:()=>D, reload:()=>load(true)};

/* ---------- the panel's own look ---------- */
const css = document.createElement("style");
css.textContent = `
.drv-card{border:1px solid var(--line,#E3E6EF);border-radius:14px;padding:16px 18px;margin:0 0 16px;background:#fff;}
.drv-card.drv-todo{border-color:#EAD5B4;background:#FBF3E7;}
.drv-card.drv-warn{border-color:#F0CFCF;background:#FDF2F2;}
.drv-card.drv-ok{border-color:#CBE6CF;background:#F6FBF7;}
.drv-c-h{font-weight:800;color:var(--navy,#1B2240);font-size:15px;margin-bottom:5px;}
.drv-card p{font-size:13px;line-height:1.55;color:var(--ink,#1B1E2E);margin:0 0 12px;max-width:80ch;}
.drv-wrap{position:fixed;inset:0;z-index:4000;background:rgba(15,20,40,.55);display:flex;align-items:center;justify-content:center;padding:24px;}
.drv-cardw{width:min(680px,100%);max-height:100%;display:flex;flex-direction:column;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(10,15,35,.35);}
.drv-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px 12px;border-bottom:1px solid var(--line,#E3E6EF);}
.drv-head h3{margin:2px 0 0;font-size:18px;color:var(--navy,#1B2240);}
.drv-eyebrow{font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--orange-deep,#B9610F);}
.drv-x{border:0;background:none;font-size:17px;line-height:1;color:var(--ink-soft,#6E748C);cursor:pointer;padding:4px 6px;border-radius:6px;}
.drv-x:hover{background:#EEF0F6;}
.drv-body{padding:16px 20px;overflow:auto;}
.drv-p{font-size:13px;line-height:1.6;color:var(--ink,#1B1E2E);margin:0 0 14px;}
.drv-meta{font-size:12px;color:var(--ink-soft,#6E748C);margin:12px 0 0;}
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
.drv-foot{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:12px 20px;border-top:1px solid var(--line,#E3E6EF);background:#F8F9FC;}
.drv-btn{border:1px solid var(--line,#E3E6EF);background:#fff;color:var(--navy,#1B2240);border-radius:8px;padding:7px 12px;font:inherit;font-size:12px;font-weight:800;cursor:pointer;text-decoration:none;}
.drv-btn:hover:not(:disabled){border-color:var(--orange,#DB8437);}
.drv-btn:disabled{opacity:.6;cursor:default;}
.drv-btn.drv-go{background:var(--navy,#1B2240);border-color:var(--navy,#1B2240);color:#fff;}
@media (max-width:760px){ .drv-wrap{padding:0;} .drv-cardw{width:100%;height:100%;border-radius:0;} }`;
document.head.appendChild(css);

document.addEventListener("keydown", (e)=>{ if(e.key === "Escape" && open) close(); });
window.addEventListener("load", ()=>{ setTimeout(()=>load(), 500); });
})();
