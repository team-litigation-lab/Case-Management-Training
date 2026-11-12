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
     1. Links their own Google account once, with 🔗 Link my Google Drive in step 1 of Day 1's Backup File
        Maintenance slide (or Connect in this panel: the same sign-in). drive.file only: the platform can see
        and change the folders and files it makes and nothing else in their Drive.
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
        driveNaming in worker.js): this file only draws them.

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
let waiting = false, linkErr = "";   // Google's sign-in window is open; and why the last try to link didn't finish (shown in step 1 of the slide)
let linkHeld = false;                // the keyboard was on the slide's link button when it was last drawn
let graded = null, verified = null;
let tree = null;               // the layout the trainee is building: [{name, children:[…]}]
let gisLoading = false, gisFailed = false;

const signedTrainee = ()=> typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;
/* A trainee on their own screen: the only place a drive is linked from. Never a trainer, an admin's preview, or the
   slides window a presenter shares (js/cm-updates.js), where the slide's button is a sample to point at. */
const ownScreen = ()=> signedTrainee() && !(typeof PV_IS_AUDIENCE !== "undefined" && PV_IS_AUDIENCE);

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
  if(!D){ load(); return ""; }
  if(!D.configured) return "";                     // not switched on for this site: say nothing
  const n = (D.standard || []).length;
  if(!D.built) return `<div class="drv-card drv-todo">
    <div class="drv-c-h">📂 Day 1 · Set up your Backup Drive</div>
    <p>Every document you file in the CMS is also kept on the firm's backup drive, in the same case file you work from here — intake, records, bills, liens, litigation. Before Day 1's first block, connect your own Google Drive and lay the firm's ${n}-folder structure out in it yourself. It is graded, and it is where your work goes for the rest of the programme.</p>
    ${steps()}
    ${namingBox({day:1, compact:true})}
    <button type="button" class="btn btn-navy btn-sm" onclick="CMDrive.show()">📂 Set up my Backup Drive</button>
  </div>`;
  const missing = (D.lastMissing || []).length, misnamed = wrongNames();
  return `<div class="drv-card ${missing || misnamed ? "drv-warn" : "drv-ok"}">
    <div class="drv-c-h">📂 Backup Drive ${missing ? `· ${missing} folder${missing === 1 ? "" : "s"} missing` : misnamed ? `· ${misnamed} name${misnamed === 1 ? "" : "s"} to fix` : "· in order"}</div>
    <p>${missing ? `${missing} of the firm's folders ${missing === 1 ? "is" : "are"} no longer in your Drive. A document filed into a folder that isn't there is a document the firm has lost.`
      : `The firm's ${n} folders are in your Drive${D.email ? ` (${esc(D.email)})` : ""}${(D.saved || []).length ? `, holding ${(D.saved || []).length} filed document${(D.saved || []).length === 1 ? "" : "s"}` : ""}.`}</p>
    ${steps()}
    ${misnamed ? `<p class="drv-c-nm">🏷 ${misnamed} name${misnamed === 1 ? " isn't" : "s aren't"} the firm's way. Open your Backup Drive to see each one, and the name it should have.</p>` : ""}
    ${namingBox({day:0, compact:true})}
    ${gradeLine()}
    <button type="button" class="btn ${missing || misnamed ? "btn-navy" : "btn-ghost"} btn-sm" onclick="CMDrive.show()">📂 Open my Backup Drive</button>
  </div>`;
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
    ${li(!!D.connected, "Connect your Google Drive")}
    ${li(!!D.built && !missing, "Build the firm's folders" + (missing ? ` — ${missing} missing, put them back` : ""))}
    ${li(saved > 0, "Keep every document you file backed up in its folder, named the firm's way" + (saved ? ` (${saved} so far)` : ""))}
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
      <button type="button" class="drv-btn drv-go" onclick="CMDrive.connect()" ${connecting || waiting ? "disabled" : ""}>${GLOGO}${connecting || waiting ? "Connecting…" : "Connect my Google Drive"}</button>`;
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
      ${namingBox({day:0})}
      ${namingReport()}
      ${gradesHTML()}`;
  }
  const foot = !D || !D.configured || !D.connected ? "" :
    !D.built ? `<button type="button" class="drv-btn drv-go" onclick="CMDrive.submit()" ${busy ? "disabled" : ""}>${busy ? "Checking…" : "Check and build it in my Drive"}</button>
                <button type="button" class="drv-btn" onclick="CMDrive.disconnect()">Disconnect</button>`
    : `<button type="button" class="drv-btn" onclick="CMDrive.check()" ${busy ? "disabled" : ""}>${busy ? "Checking…" : "↻ Check my drive"}</button>
       <button type="button" class="drv-btn" onclick="CMDrive.grade(true)" ${grading ? "disabled" : ""}>${grading ? "Grading…" : "🏅 Grade my backup"}</button>
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
  sc.onload = ()=>{ gisLoading = false; if(linkErr === GIS_WAIT || linkErr === GIS_GONE){ linkErr = ""; redrawSlides(); } };
  sc.onerror = ()=>{ gisLoading = false; gisFailed = true; err = "Google sign-in couldn't load. Check that accounts.google.com isn't blocked, then try again."; if(linkErr === GIS_WAIT) linkErr = GIS_GONE; paint(); redrawSlides(); };
  document.head.appendChild(sc);
}
const GIS_WAIT = "Google sign-in is still loading. Press the button again in a moment.";
const GIS_GONE = "Google sign-in couldn't load. Check that accounts.google.com isn't blocked, then press the button again.";
/* A try to link that didn't finish: said once as a toast, and kept as a line in step 1 of the slide until the next try. */
function linkFail(m){ linkErr = m; say(m); paint(); redrawSlides(); }
function connect(){
  const oauth = window.google && google.accounts && google.accounts.oauth2;
  if(!D || !D.configured || waiting || connecting) return;
  linkErr = "";
  if(!oauth){
    // not here yet, or it failed to load: fetch it (again), so the next press works
    const failed = gisFailed; gisFailed = false; preloadGis();
    linkFail(failed ? GIS_GONE : GIS_WAIT); return;
  }
  let client = null;
  try{
    client = oauth.initCodeClient({
      client_id: D.clientId, scope: D.scopes, ux_mode: "popup", select_account: true,
      callback: async (resp)=>{
        waiting = false;
        if(!resp || resp.error || !resp.code){ linkFail(resp && resp.error === "access_denied" ? "Google access wasn't allowed. Press the button again and choose Allow." : "Google sign-in didn't finish. Press the button again."); return; }
        connecting = true; err = ""; paint(); redrawSlides();
        let failed = "";
        try{ D = (await api({action:"connect", code:resp.code})).drive; tree = [{name:"", children:[]}]; say(`Google Drive linked${D.email ? ` (${D.email})` : ""}.`); }
        catch(e){
          // DRIVE_SCOPE_MISSING (the Drive box was unticked) and DRIVE_CONSENT_AGAIN (Google remembered an old
          // yes and sent no lasting access): the Worker has already cleared that grant, so pressing again works.
          // Read the status afresh, since a link held before may have gone with it.
          err = e.message;
          failed = e.code === "DRIVE_CONSENT_AGAIN" ? "One more step: press the button again and approve."
            : e.code === "DRIVE_SCOPE_MISSING" ? "Google Drive access wasn't ticked. Press the button again and tick the Drive box on Google's screen."
            : e.message;
          if(e.code === "DRIVE_SCOPE_MISSING" || e.code === "DRIVE_CONSENT_AGAIN"){ try{ D = (await api()).drive; }catch(x){} }
        }
        connecting = false; fillSlot();
        if(failed) linkFail(failed); else { paint(); redrawSlides(); }
      },
      error_callback: (e)=>{
        const t = e && e.type;
        waiting = false;
        linkFail(t === "popup_closed" ? "Google sign-in was closed before it finished. Press the button again."
          : t === "popup_failed_to_open" ? "The browser blocked the Google sign-in window. Allow pop-ups for this site, then press the button again."
          : "Google sign-in failed. Press the button again.");
      }
    });
    waiting = true; paint(); redrawSlides();   // the button reads Linking… while Google's window is open
    client.requestCode();
  }catch(e){ waiting = false; linkFail("Google sign-in failed. Press the button again."); }
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
/* 🔗 Link my Google Drive, in step 1 of Day 1's slide. A trainee on their own screen starts Google's sign-in from the
   slide itself; for anyone else the button is a sample (a trainer points at it), and pressing it asks nothing of
   Google or of the Worker. */
async function link(){
  if(!ownScreen()){ saySample("Trainees link their own Google Drive with this button, on their own screen."); return; }
  if(waiting || connecting) return;
  if(!D){
    linkErr = ""; await load(true);
    if(!D){ linkErr = err || "Your Backup Drive couldn't be reached. Press the button again."; redrawSlides(); return; }
  }
  if(!D.configured || D.connected){ redrawSlides(); return; }
  connect();
}
async function disconnect(){
  if(!D || !D.connected || busy) return;
  if(!confirm("Disconnect Google Drive? The folders and files already in your Drive stay there, and your Day 1 grade is kept.")) return;
  busy = true; paint();
  try{ D = (await api({action:"disconnect"})).drive; verified = null; graded = null; err = ""; linkErr = ""; say("Google Drive disconnected."); }
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
    try{ if(typeof storeSet === "function") await storeSet("drive-setup", {score:graded.score, ok:graded.ok, attempts:(D.setup && D.setup.attempts) || 1, at:new Date().toISOString(), left:graded.problems.length}); }catch(e){}
    if(graded.ok) say("Your Backup Drive is built — the structure is in your Drive.");
    else say(`${graded.problems.length} thing${graded.problems.length === 1 ? "" : "s"} to fix before it is built.`);
    fillSlot();
  }catch(e){ err = e.message; }
  busy = false; paint(); redrawSlides();
}
async function check(){
  if(busy) return;
  busy = true; err = ""; paint();
  try{ const out = await api({action:"check"}); verified = out.verified; D = out.drive; }
  catch(e){ err = e.message; }
  busy = false; paint(); fillSlot(); redrawSlides(); grade(true);   // and every name on the drive is read with it
}
async function rebuild(){
  if(busy) return;
  busy = true; err = ""; paint();
  try{ const out = await api({action:"rebuild"}); D = out.drive; verified = {missing:[]}; say("The missing folders are back in your Drive."); }
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
  try{
    const out = await api({action:"grade", filed: filedIds()});
    D = out.drive;
    try{ if(typeof storeSet === "function") await storeSet("drive-grades", Object.fromEntries(Object.entries(out.grades || {}).map(([n, g])=>[n, {score:g.score, passed:g.passed, at:g.at, issues:[].concat(...(g.rows || []).map(r=>r.notes || [])).slice(0, 4)}]))); }catch(e){}
  }catch(e){ /* the grade waits for the next check; nothing else is blocked */ }
  grading = false; paint(); fillSlot();
  redrawSlides();
  refreshBoxes();
  try{ window.dispatchEvent(new CustomEvent("cm-drive-graded")); }catch(e){}
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
    ${days.map(n=>{ const x = g[n], notes = [].concat(...(x.rows || []).map(r=>r.notes || []));
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
   🔗 Link my Google Drive starts Google's sign-in from the slide (connect), then shows who is linked. */
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
  const linked = !!(me && me.connected), linking = mine && (waiting || connecting);
  if(me && !linked) preloadGis();   // so Google's sign-in is already there at the first press
  // Step 1 is where the drive is linked: the button (a sample for anyone but a trainee on their own screen), then who is linked
  const linkBox = off ? "" : linked
    ? `<div class="drv-s-act"><span class="drv-s-ok">Linked${me.email ? `: <b>${esc(me.email)}</b>` : ""}</span>${/^https:\/\//.test(me.rootUrl || "") ? `<a class="drv-s-open" href="${esc(me.rootUrl)}" target="_blank" rel="noopener noreferrer">Open my Drive ↗</a>` : ""}</div>`
    : `<div class="drv-s-act"><button type="button" class="drv-s-link" data-drv-link onclick="CMDrive.link()" ${linking ? "disabled" : ""}><span class="drv-s-g">${GLOGO}</span>${linking ? "Linking…" : "🔗 Link my Google Drive"}</button></div>${mine && linkErr && !linking ? `<div class="drv-s-err" role="alert">⚠ ${esc(linkErr)}</div>` : ""}`;
  const build = linked && !me.built ? `<div class="drv-s-act"><button type="button" class="drv-s-link drv-s-build" data-drv-build onclick="CMDrive.show()">📂 Build my folders</button></div>` : "";
  const scope = "The platform asks for <b>drive.file</b> only: it sees the folders and files it makes, nothing else.";
  const steps = [
    ["Link your Google Drive", (off || linked ? "" : "Press the button here. ") + scope, linked, linkBox],
    ["Build the firm's folders by hand", "Every folder named, numbered, nested and in order, exactly to the standard. Submit it: it is graded folder by folder.", !!(me && me.built), build],
    ["✓ Check my drive", "Confirm every folder is still there. Put back anything missing.", !!(me && me.built && me.checkedAt && (!me.builtAt || me.checkedAt >= me.builtAt) && !missing), ""],
    ["File in the CMS, every day", "Each document you file lands in its folder on the drive too, under the name you filed it with.", !!(me && (me.saved || []).length), ""]
  ];
  const list = (STD && STD.standard) || [];
  const tree = list.length
    ? `<div class="drv-s-root">📁 <b>${esc(STD.root)}</b></div><ul class="drv-s-tree">${list.map(p=>{
        const depth = p.split("/").length - 1;
        return `<li style="padding-left:${depth * 22}px" title="${esc((STD.why || {})[p] || "")}">📁 <b>${esc(p.split("/").pop())}</b></li>`;
      }).join("")}</ul>`
    : `<p class="drv-s-note">${STD && STD.failed ? "The firm's structure couldn't be loaded. Open 📂 My Backup Drive to see it." : "Loading the firm's structure…"}</p>`;
  return `<div class="drv-slide" data-drv-slide>
    <div class="drv-s-col"><div class="drv-s-top"><h3>📋 Your Task: The Case Backup</h3>${!off && mine ? `<button type="button" class="btn btn-navy btn-sm" onclick="CMDrive.show()">📂 Open My Backup Drive</button>` : ""}</div>
      <ol class="drv-s-steps">${steps.map(([h, t, done, extra], i)=>`<li class="${done ? "is-done" : ""}"><span class="drv-s-n">${done ? "✓" : i + 1}</span><div><b>${h}</b><span>${t}</span>${extra}</div></li>`).join("")}</ol>
      ${off ? `<p class="drv-s-note">Google linking isn't switched on for this site yet: a trainer adds it once (README → 📂 The trainee's Backup Drive).</p>` : ""}
      ${namingBox({day:1, slide:true})}
    </div>
    <div class="drv-s-col"><h3>🗂 The Firm's Standard</h3>${tree}</div>
  </div>`;
}

/* ---------- 🏷 the firm's naming convention: the box, and the report of every name on the drive ----------
   Everything here is drawn from what the Worker says (the drive status for a trainee, "standard" for a presenter):
   the pattern, its parts, the Types, the labels, what a day's grade gives the names, and the last check of them. */
const E = esc;
const rule = ()=> (D && D.naming) || (STD && STD.naming) || null;
const wrongNames = ()=> { const R = (rule() || {}).report; return R ? R.wrong || 0 : 0; };
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
const weightLine = ()=>{ const N = rule(); return N && N.points ? `🏷 File names are <b>${N.points} of the ${N.of} points</b> the platform grades on each day's Backup File Maintenance.` : ""; };
/* The 🏷 box. `day` picks the example (0: the drive as a whole); `compact` leaves the parts and the scope to the
   panel; on a slide it is drawn in the deck's own size. It is redrawn in place when the rule or the Case ID arrives. */
function namingBox(o){
  o = o || {};
  const day = Number(o.day) || 0, N = rule();
  const attrs = `data-drv-naming="${day}" data-c="${o.compact ? 1 : 0}" data-s="${o.slide ? 1 : 0}"`;
  const cls = `drv-nc${o.compact ? " drv-nc-c" : ""}${o.slide ? " drv-nc-s" : ""}`;
  if(!N){
    if(signedTrainee()){ if(!D) load(); } else if(!STD) loadStandard();
    return `<div class="${cls}" ${attrs}><div class="drv-nc-h">🏷 Naming convention</div><p class="drv-nc-w">${STD && STD.failed ? "The firm's naming convention couldn't be loaded. Open 📂 My Backup Drive to see it." : "Loading the firm's naming convention…"}</p></div>`;
  }
  const ex = exampleFor(day || 2), mine = !!myCase();
  if(o.slide) return `<div class="${cls}" ${attrs}>
    <div class="drv-nc-r"><b class="drv-nc-h">🏷 Naming convention</b><code class="drv-nc-pat">${E(N.pattern)}</code>${day > 1 && N.points ? `<span class="drv-nc-pts" title="File names are ${N.points} of the ${N.of} points the platform grades on each day's Backup File Maintenance">🏅 ${N.points} of the ${N.of} graded points</span>` : ""}</div>
    ${ex.name ? `<div class="drv-nc-r" title="${E(ex.title)}"><span>Example, filed today:</span><code class="drv-nc-exc">${E(ex.name)}</code><button type="button" class="drv-nc-copy" data-copy="${E(ex.name)}" onclick="CMDrive.copy(this)">📋 Copy</button></div>` : ""}
    ${day >= 3 ? `<div class="drv-nc-r"><span>A label goes last:</span>${(N.labels || []).map(([word, add, what])=>`<span><code>…${E(add)}.pdf</code> ${E(what)}</span>`).join("")}</div>` : ""}
  </div>`;
  const labels = (N.labels || []).map(([word, add, what])=>`<span><code>…${E(add)}.pdf</code> ${E(what)}</span>`).join("");
  return `<div class="${cls}" ${attrs}>
    <div class="drv-nc-h">🏷 Naming convention <span>every file on your Backup Drive</span></div>
    <code class="drv-nc-pat">${E(N.pattern)}</code>
    ${ex.name ? `<div class="drv-nc-ex"><span>Example${mine ? ", with your Case ID" : ""} · ${E(ex.title)}, filed today</span>
      <code>${E(ex.name)}</code><button type="button" class="drv-nc-copy" data-copy="${E(ex.name)}" onclick="CMDrive.copy(this)">📋 Copy</button></div>` : ""}
    ${o.compact ? "" : `<ul class="drv-nc-parts">${(N.parts || []).map(([p, what])=>`<li><code>${E(p === "ext" ? ".<ext>" : `<${p}>`)}</code> ${E(what)}</li>`).join("")}</ul>`}
    ${(!o.compact || day >= 3) && labels ? `<div class="drv-nc-lab"><b>A label is the last part:</b>${labels}</div>` : ""}
    <p class="drv-nc-w">${weightLine()}${o.compact ? "" : " A copy keeps the name you filed it under in the CMS; rename a file in Google Drive only to add a label, or to fix a name this check reports."}</p>
  </div>`;
}
function refreshBoxes(){
  const onSlide = !!document.querySelector("#lessonSlideWrap [data-drv-naming]");
  document.querySelectorAll("[data-drv-naming]").forEach(el=>{ el.outerHTML = namingBox({day:Number(el.dataset.drvNaming) || 0, compact:el.dataset.c === "1", slide:el.dataset.s === "1"}); });
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
/* A name with one of its pieces marked: n is its place between the underscores ("ext": the extension, 0: all of it, -1: none). */
function marked(name, n, cls){
  const s = String(name || ""), dot = s.lastIndexOf("."), hasExt = dot > 0 && dot < s.length - 1;
  const parts = (hasExt ? s.slice(0, dot) : s).split("_"), ext = hasExt ? s.slice(dot + 1) : "";
  const m = (t)=> `<mark class="${cls}">${E(t)}</mark>`;
  if(!n) return m(s);
  if(n === "ext") return E(parts.join("_")) + (hasExt ? "." + m(ext) : "");
  return parts.map((p, i)=> i === n - 1 ? m(p) : E(p)).join("_") + (hasExt ? "." + E(ext) : "");
}
/* The last check of the names, as the Worker reported it: each wrong one with its folder, the name as it is, the name
   it should have and the part that differs; then what the check sees and what it can't. */
function namingReport(){
  const N = rule(), R = N && N.report;
  if(!N) return "";
  const scope = `<p class="drv-nr-see"><b>✓ What this check reads:</b> ${E(N.sees || "")}</p><p class="drv-nr-see drv-nr-blind"><b>⚠ What it can't see:</b> ${E(N.blind || "")}</p>`;
  if(!R) return `<div class="drv-nr"><div class="drv-nr-h">🏷 File names</div><p class="drv-nr-sub">Every name on your drive is read when you run ↻ Check my drive, and each time a document you file lands here.</p>${scope}</div>`;
  const all = R.checked || 0, bad = R.wrong || 0, list = R.list || [];
  return `<div class="drv-nr">
    <div class="drv-nr-h">🏷 File names <span class="drv-score ${bad ? "is-low" : "is-pass"}">${bad ? `${bad} to fix` : "all named the firm's way"}</span></div>
    <p class="drv-nr-sub">${all ? `${R.named} of ${all} file${all === 1 ? "" : "s"} named the firm's way` : "No file is on your drive yet"}${R.at ? ` · checked ${E(new Date(R.at).toLocaleString())}` : ""}</p>
    ${list.map(x=>`<div class="drv-nr-it">
      <div class="drv-nr-f">✗ ${x.kind === "folder" ? "Folder in" : "In"} <b>${E(x.folder)}</b></div>
      <div class="drv-nr-l"><span>Named</span><code>${marked(x.name, x.kind === "folder" ? 0 : !x.got ? -1 : x.part === "ext" ? "ext" : x.n, "drv-nr-bad")}</code></div>
      <div class="drv-nr-l"><span>Should be</span><code>${x.kind === "folder" ? `<mark class="drv-nr-good">${E(x.want)}</mark>` : marked(x.want, x.part === "ext" ? "ext" : x.n || -1, "drv-nr-good")}</code>${/[<>]/.test(x.want) ? "" : `<button type="button" class="drv-nc-copy" data-copy="${E(x.want)}" onclick="CMDrive.copy(this)">📋 Copy</button>`}</div>
      <div class="drv-nr-hint">👉 ${E(x.hint)}</div>
    </div>`).join("")}
    ${bad > list.length ? `<p class="drv-nr-sub">…and ${bad - list.length} more.</p>` : ""}
    ${bad ? `<p class="drv-nr-sub">Rename each one in Google Drive (right-click → Rename), then run ↻ Check my drive again.</p>` : ""}
    ${scope}
  </div>`;
}

window.CMDrive = {card, slot, show, close, connect, link, disconnect, submit, check, rebuild, saveFiled, slide, grade, dayOpened,
  namingBox, namingReport, nameFor, copy, naming:rule,
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
.drv-cardw{width:min(800px,100%);max-height:100%;display:flex;flex-direction:column;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(10,15,35,.35);}
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
.drv-grades{margin-top:14px;border:1px solid var(--line,#E3E6EF);border-radius:10px;padding:10px 12px;background:#FAFBFE;}
.drv-g-h{font-weight:800;color:var(--navy,#1B2240);font-size:13.5px;margin-bottom:6px;}
.drv-g-row{padding:6px 0;border-top:1px dashed var(--line,#E3E6EF);font-size:12.5px;}
.drv-g-row:first-of-type{border-top:0;}
.drv-g-row b{color:var(--navy,#1B2240);} .drv-g-row small{display:block;color:var(--ink-soft,#6E748C);margin-top:2px;}
.drv-g-row ul{margin:4px 0 0;padding-left:18px;color:#8A2B2B;} .drv-g-row li{margin-bottom:2px;}
.drv-score{float:right;font-weight:800;border-radius:999px;padding:1px 9px;font-size:12px;}
.drv-score.is-pass{background:#F1F8F2;color:#245B32;border:1px solid #CBE6CF;} .drv-score.is-low{background:#FDF2F2;color:#8A2B2B;border:1px solid #F0CFCF;}
.drv-slide{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px;}
.drv-slide,.drv-slide *{text-align:left!important;}
.drv-slide li::before,.drv-slide li::marker{content:none!important;display:none!important;}
.drv-s-col{background:#fff;border:1px solid #DDE1EA;border-radius:14px;padding:12px 18px 10px;color:#141A2E;}
.drv-s-col h3{margin:0 0 6px;font:800 20px 'Poppins','Inter',sans-serif;color:#1E2340;}
.drv-s-steps{list-style:none;margin:0 0 6px;padding:0;display:flex;flex-direction:column;gap:6px;}
.drv-s-steps li{display:flex;gap:12px;align-items:flex-start;margin:0;padding:0;}
.drv-s-n{flex:0 0 32px;height:32px;border-radius:50%;background:#1E2340;color:#F6C08F;display:flex;align-items:center;justify-content:center;font:800 16px 'Inter',sans-serif;}
.drv-s-steps li.is-done .drv-s-n{background:#1E8E4F;color:#fff;}
.drv-s-steps li > div > b{display:block;font:800 18px 'Inter',sans-serif;color:#1E2340;}
.drv-s-steps span b{font-weight:800;color:#1E2340;}
.drv-s-steps li > div > span{display:block;font:600 16px/1.4 'Inter',sans-serif;}
.drv-s-act{display:flex;align-items:center;gap:4px 14px;flex-wrap:wrap;margin-top:5px;}
.drv-s-link{display:inline-flex;align-items:center;gap:8px;border:2px solid #1E2340;background:#1E2340;color:#fff;border-radius:10px;padding:4px 16px 4px 7px;font:800 17px/1.3 'Inter',sans-serif;cursor:pointer;box-shadow:0 3px 0 #DB8437;margin-bottom:3px;}
.drv-s-link:hover:not(:disabled){background:#DB8437;border-color:#DB8437;color:#1E2340;box-shadow:0 3px 0 #1E2340;}
.drv-s-link:focus-visible,.drv-s-open:focus-visible{outline:3px solid #DB8437;outline-offset:3px;}
.drv-s-link:disabled{opacity:.7;cursor:default;}
.drv-s-g{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:#fff;}
.drv-s-g svg{width:16px;height:16px;margin:0!important;vertical-align:0!important;display:block;}
.drv-s-link.drv-s-build{background:#fff;color:#1E2340;padding:4px 16px;}
.drv-s-ok{font:800 16px/1.4 'Inter',sans-serif;color:#1E8E4F;overflow-wrap:anywhere;}
.drv-s-open{font:800 16px/1.4 'Inter',sans-serif;color:#1E2340;text-decoration:underline;text-decoration-color:#DB8437;text-decoration-thickness:2px;text-underline-offset:3px;white-space:nowrap;}
.drv-s-open:hover{color:#B9610F;}
.drv-s-err{margin-top:8px;padding:5px 12px;border-left:4px solid #DB8437;border-radius:6px;background:#FFF8F0;color:#1E2340;font:700 16px/1.4 'Inter',sans-serif;}
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
.drv-nc.drv-nc-s{margin:10px 0 0;padding:8px 14px;font:700 16px/1.4 'Inter',sans-serif;}
.drv-slide .drv-nc.drv-nc-s{margin-top:8px;padding:6px 14px;}
.drv-nc-s .drv-nc-r{display:flex;align-items:center;gap:6px 12px;flex-wrap:wrap;}
.drv-nc-s .drv-nc-r + .drv-nc-r{margin-top:6px;}
.drv-nc-s .drv-nc-r > span{font:700 16px/1.4 'Inter',sans-serif;color:#1E2340;}
.drv-nc-s .drv-nc-h{font:800 18px 'Poppins','Inter',sans-serif;margin:0;}
.drv-nc-s code{font-size:16px;}
.drv-nc-s .drv-nc-pat{display:inline-block;font-size:16px!important;padding:5px 10px;}
.drv-nc-s .drv-nc-exc{background:#fff;border:1.5px solid #DB8437;border-radius:8px;padding:3px 9px;}
.drv-nc-s .drv-nc-copy{font-size:16px;padding:3px 10px;}
.drv-nc-s .drv-nc-r > span code{color:#B9610F;}
.drv-nc-pts{margin-left:auto;background:#1E2340;color:#F6C08F!important;border-radius:999px;padding:3px 12px;font:800 16px 'Inter',sans-serif!important;white-space:nowrap;}
.drv-s-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;}
.drv-s-top h3{margin:0;}
.drv-c-nm{font:700 14px/1.45 'Inter',sans-serif!important;color:#8A2B2B!important;margin:0 0 8px!important;}
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
.drv-nr-hint{margin-top:6px;font:700 14px/1.45 'Inter',sans-serif;color:#1E2340;background:#FFF8F0;border-left:4px solid #DB8437;border-radius:6px;padding:5px 9px;}
.drv-nr-see{margin:10px 0 0;font:700 14px/1.45 'Inter',sans-serif;color:#1E2340;}
.drv-nr-see b{font-weight:800;}
.drv-nr-blind{margin-top:4px;background:#FFF8F0;border-left:4px solid #DB8437;border-radius:6px;padding:5px 9px;}
@media (max-width:860px){ .drv-slide{grid-template-columns:1fr;} }
@media (max-width:760px){ .drv-wrap{padding:0;} .drv-cardw{width:100%;height:100%;border-radius:0;} }`;
document.head.appendChild(css);

document.addEventListener("keydown", (e)=>{ if(e.key === "Escape" && open) close(); });
// The trainee is back on this window and Google's has said nothing (a browser that hides the window's closing from
// Google's script): the button works again rather than reading Linking… for good. An answer that follows is still taken.
window.addEventListener("focus", ()=>{ if(waiting){ waiting = false; paint(); redrawSlides(); } });
window.addEventListener("load", ()=>{ setTimeout(()=>load(), 500); });
})();
