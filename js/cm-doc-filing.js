/* 📤 Filing the case documents into the CMS, named the firm's way.

   A Case Flow block works from documents (📁 Work from). A Case Manager doesn't read them and leave them
   in a folder: every one is filed into the case in the CMS, under the right category, named the firm's way:

       <Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.<ext>

   This panel is that job. For each document of the block: pick the CMS category, write the file name, and
   press "File it in the CMS". The document itself is sent to the CMS open beside the lesson, which checks
   the name against the convention (its course-bridge.js, caseFileName in its app.js — the firm's one rule)
   and files it into the case under that category, through the same upload a trainee would use in the CMS.

   Strict on purpose: a wrong name files nothing and comes back with what is wrong with each part, and a
   document put in the wrong category is refused with where the firm files it. Nothing is corrected quietly,
   because the convention is the thing being learned. Each document's attempts are kept, so a trainer can
   see who filed the repository right the first time.

   It also files a document the course itself produced — the Service Confirmation's memorandum, built from the
   trainee's own confirmation email and the adjuster's acknowledgment (cmDocFiling.send) — through the same
   name check and the same upload, and keeps it on the trainee's Backup Drive in its folder, exactly as a case
   document is kept (js/cm-drive.js).

   What is needed: the CMS open beside the lesson (🗂 Open CMS) with the trainee's own case open in it. The
   panel says so when it isn't, and nothing else is blocked.  Course side of the CMS's course-bridge.js.

   It also relays for the Portal's simulators. The Medical Records Requests simulator produces the records
   and the itemized bill a provider sends back as real files, and files them into the case the same way;
   opened from a lesson it is a frame or a tab of this course, not of the CMS, so it cannot reach the CMS
   itself. So this course passes a document it sends on to the CMS beside the lesson, unchanged, and hands
   the CMS's answer straight back — the same name check, the same category, the same upload. Only the
   Portal may ask (RELAY_ORIGINS), and a document is only ever relayed: nothing here decides a name. */
(function(){
const esc = (s)=> String(s == null ? "" : s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// the Doc Hub categories in the CMS, and where each document's own "cms" short label belongs
const CATEGORIES = ["Intake Documents", "Medical Records", "Police Report", "Case Files", "Invoices", "Bills", "Property Damage", "Litigation Documents", "Others"];
const LONG = {"Case Files":"Case Files", "Medical":"Medical Records", "Police":"Police Report", "Bills":"Bills",
              "Invoices":"Invoices", "PD":"Property Damage", "Litigation":"Litigation Documents", "Others":"Others",
              "Intake":"Intake Documents"};
const KEY = "doc-filing";
const docOf = (id)=> (typeof cmDoc === "function" && cmDoc(id)) || null;
const urlOf = (d)=> typeof cmDocUrl === "function" ? cmDocUrl(d) : "documents/" + d.file;
// to read it: the document in the page (case-doc.html), never a download; urlOf stays the original file, which is what gets filed
const viewOf = (d)=> /^RS\d\d$/.test(d.id) ? `case-doc.html?id=${d.id}${window.CM_CASE_DATES && CM_CASE_DATES.year ? `&year=${CM_CASE_DATES.year}` : ""}${window.CM_CASE_DATES && CM_CASE_DATES.dolOffset ? `&dol=${CM_CASE_DATES.dolOffset}` : ""}` : urlOf(d);
const basename = (d)=> String(d.file || "").split("/").pop();
const expectedCategory = (d)=> LONG[d.cms] || d.cms || "Others";
const rid = ()=> "f" + Math.random().toString(36).slice(2, 10);

const log = ()=> (state.docFiling = state.docFiling || {});
const recOf = (docId)=> log()[docId] || null;
async function save(){ try{ if(typeof storeSet === "function") await storeSet(KEY, log()); }catch(e){} }

/* ---------- the CMS beside the lesson ---------- */
function cmsFrame(){
  return Array.from(document.querySelectorAll("iframe")).find(f=>{
    const src = (f.dataset && (f.dataset.src || f.dataset.base)) || f.getAttribute("src") || "";
    return /trainingcrm|lshcasemanagementtraining/i.test(src) || /localhost|127\.0\.0\.1/.test(src) && /cms/i.test(src);
  }) || null;
}
const caseOpen = ()=> (window.CMCase && CMCase.id()) || "";
/* Ask the CMS to do one thing and wait for its answer (it echoes the id back). */
function askCms(msg, replyKind, transfer){
  // the CMS beside the lesson, or else a CMS tab this course opened (🧰 Tools → New tab)
  const f = cmsFrame(), tab = (window.__cmsTabs || []).filter(w=>w && !w.closed).pop();
  const target = (f && f.contentWindow) || tab;
  if(!target) return Promise.resolve({ok:false, error:"The CMS isn't open beside this lesson. Press 🗂 Open CMS, sign in if it asks, and open your own case."});
  const id = rid();
  return new Promise(res=>{
    const on = (e)=>{ if(e.data && e.data.lsh === replyKind && e.data.id === id){ window.removeEventListener("message", on); res(e.data); } };
    window.addEventListener("message", on);
    try{ target.postMessage(Object.assign({id}, msg), "*", transfer || []); }
    catch(err){ window.removeEventListener("message", on); return res({ok:false, error:"The document could not be sent to the CMS."}); }
    setTimeout(()=>{ window.removeEventListener("message", on); res({ok:false, error:"The CMS didn't answer. Is your case open in it?"}); }, 20000);
  });
}

/* ---------- the panel ---------- */
function rowHTML(blockId, d){
  const r = recOf(d.id) || {}, k = `${blockId}__${d.id}`.replace(/\W/g, "_");
  const filed = !!r.filed;
  return `<div class="dfl-row${filed ? " dfl-done" : ""}" data-k="${k}">
    <div class="dfl-doc"><a href="${esc(viewOf(d))}" target="_blank" rel="noopener" onclick="return window.cmCaseFlow && cmCaseFlow.doc ? cmCaseFlow.doc(event,'${esc(d.id)}') : true">${esc(d.title)}</a>
      <span class="dfl-file">${esc(basename(d))}</span></div>
    ${filed ? `<div class="dfl-ok">✓ Filed in the CMS as <b>${esc(r.name)}</b> under ${esc(r.category)}${r.attempts > 1 ? ` · ${r.attempts} attempts` : " · first time right"}</div>`
      : `<div class="dfl-fields">
        <select class="dfl-cat" aria-label="CMS category for ${esc(d.title)}"><option value="">CMS category…</option>
          ${CATEGORIES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("")}</select>
        <input class="dfl-name" aria-label="File name for ${esc(d.title)}" placeholder="${esc(namePattern(d))}">
        <button type="button" class="btn btn-navy btn-sm" onclick="cmDocFiling.file('${blockId}','${d.id}',this)">File it in the CMS</button>
      </div>
      <div class="dfl-msg" aria-live="polite">${r.problems && r.problems.length ? problemsHTML(r) : ""}</div>`}
  </div>`;
}
function namePattern(d){
  const id = caseOpen() || "<Case ID>";
  const ext = (/\.([A-Za-z0-9]{1,8})$/.exec(basename(d)) || [])[1] || "pdf";
  const day = new Date(), date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
  return `${id}_<Last-First>_<Type>_${date}.${ext.toLowerCase()}`;
}
const problemsHTML = (r)=> `<div class="dfl-bad"><b>Not filed.</b><ul>${(r.problems || []).map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`;

function panel(blockId){
  const ids = (window.CM_CF_DOC_PACKETS || {})[blockId] || [];
  const docs = ids.map(docOf).filter(Boolean);
  if(!docs.length) return "";
  const done = docs.filter(d=>(recOf(d.id) || {}).filed).length;
  const first = docs.filter(d=>{ const r = recOf(d.id) || {}; return r.filed && r.attempts === 1; }).length;
  return `<div class="dfl" id="dfl_${esc(blockId)}">
    <div class="dfl-h"><b>📤 File these in the CMS</b>
      <span class="dfl-conv">Name every file <code>&lt;Case ID&gt;_&lt;Last-First&gt;_&lt;Type&gt;_&lt;YYYY-MM-DD&gt;.&lt;ext&gt;</code> — the type is the CMS category you file it under.</span>
      <span class="dfl-count">${done} of ${docs.length} filed${done ? ` · ${first} first time right` : ""}</span></div>
    ${caseOpen() ? `<div class="dfl-case">Filing into <b>${esc(caseOpen())}</b>, the case open in the CMS.</div>`
      : `<div class="dfl-need">Open your own case in the CMS first: <button type="button" class="btn btn-ghost btn-sm" onclick="openTool('cms','split')">🗂 Open CMS</button></div>`}
    ${docs.map(d=>rowHTML(blockId, d)).join("")}</div>`;
}

/* ---------- filing one document ---------- */
async function file(blockId, docId, btn){
  const d = docOf(docId); if(!d) return;
  const k = `${blockId}__${docId}`.replace(/\W/g, "_");
  const row = document.querySelector(`.dfl-row[data-k="${k}"]`); if(!row) return;
  const msg = row.querySelector(".dfl-msg");
  const category = (row.querySelector(".dfl-cat") || {}).value || "";
  const name = ((row.querySelector(".dfl-name") || {}).value || "").trim();
  const say = (html)=>{ if(msg) msg.innerHTML = html; };
  const r = log()[docId] = Object.assign({attempts: 0}, recOf(docId));

  if(!caseOpen()){ say(`<div class="dfl-bad"><b>Not filed.</b><ul><li>No case is open in the CMS. Press 🗂 Open CMS, then open your own case (or save it, so it is given its Case ID).</li></ul></div>`); return; }
  if(!category){ say(`<div class="dfl-bad"><b>Not filed.</b><ul><li>Choose the CMS category you would file this document under.</li></ul></div>`); return; }

  r.attempts++;
  // the category: the repository only stays healthy if each document is where the firm keeps it
  if(category !== expectedCategory(d)){
    r.problems = [`The firm files this document under ${expectedCategory(d)}, not ${category}. A document in the wrong category is a document nobody finds.`];
    say(problemsHTML(r)); await save(); return;
  }
  if(btn){ btn.disabled = true; btn.textContent = "Filing…"; }
  let bytes = null;
  try{
    const res = await fetch(urlOf(d));
    if(!res.ok) throw new Error(`the document could not be read (${res.status})`);
    bytes = await res.arrayBuffer();
  }catch(err){
    r.problems = [`The document could not be read from this course: ${(err && err.message) || "unknown error"}.`];
    say(problemsHTML(r)); await save();
    if(btn){ btn.disabled = false; btn.textContent = "File it in the CMS"; }
    return;
  }
  // A copy for the backup drive, taken before the original is handed to the CMS (transferring it empties it here).
  const forDrive = bytes.slice(0);
  const out = await askCms({lsh:"cms-doc-file", name, category, original: basename(d), mime: mimeOf(basename(d)), summary: d.title, bytes}, "cms-doc-filed", [bytes]);
  if(btn){ btn.disabled = false; btn.textContent = "File it in the CMS"; }
  if(out && out.ok){
    r.filed = true; r.name = out.name; r.category = out.category || category; r.at = new Date().toISOString(); r.problems = [];
    await save();
    if(typeof toast === "function") toast(`Filed in the CMS as ${out.name}.`);
    // The firm keeps a backup drive as well as a CMS: the same document goes into its folder there, the
    // one this document already belongs to (d.folder, CM_CF_DOC_FOLDERS). The CMS is the file of record,
    // so a drive that isn't set up never undoes the filing — the trainee is just told what didn't reach it.
    if(window.CMDrive){
      const drv = await CMDrive.saveFiled(d.folder, out.name, forDrive);
      r.drive = drv.ok ? drv.folder : "";
      await save();
      if(drv.ok && typeof toast === "function") toast(`Kept on your Backup Drive under ${drv.folder.split("/").pop()}.`);
      else if(drv.why === "no-drive" && typeof toast === "function") toast("Filed in the CMS. Your Backup Drive isn't set up yet, so no copy was kept there.");
    }
    row.outerHTML = rowHTML(blockId, d);
    const count = document.querySelector(`#dfl_${CSS.escape(blockId)} .dfl-count`);
    if(count){ const p = panel(blockId); const m = /<span class="dfl-count">([^<]*)</.exec(p); if(m) count.textContent = m[1]; }
    return;
  }
  r.problems = (out && out.problems && out.problems.length) ? out.problems : [(out && out.error) || "The CMS did not file it."];
  say(problemsHTML(r)); await save();
}
const mimeOf = (file)=>{
  const ext = String(file).split(".").pop().toLowerCase();
  return {pdf:"application/pdf", jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", mp4:"video/mp4",
          docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}[ext] || "application/octet-stream";
};

/* ---------- send: one document the course produced, to the CMS and the Backup Drive ----------
   The same upload this panel uses, for a document the course made rather than one from the case documents:
   the letters a trainee drafts (js/cm-cms-upload.js) and the Service Confirmation's memorandum
   (js/cm-case-flow.js) both file through here, so a drafted document and a case document take one road.
   The trainee writes the name and the CMS checks it against caseFileName; what is refused here is only what
   could never reach the CMS at all, each with the reason to show the trainee. Nothing decides a name.

   And it takes the same second road a case document takes: a copy into the trainee's Backup Drive, in the
   folder the caller says this kind of document belongs in (`folder`, a CM_CF_DOC_FOLDERS id). A document the
   course produced is a document on the case like any other, so it belongs in the drive the firm reads from —
   without this, a trainee's drive held every case document and none of the ones they wrote themselves.
   The CMS stays the file of record: a drive that isn't set up, or a folder someone deleted, never undoes the
   filing. The outcome comes back on the answer (`drive`), for the caller to tell the trainee. */
async function send(d){
  if(!caseOpen()) return {ok: false, error: "No case is open in the CMS. Press 🗂 Open CMS, then open your own case (or save it, so it is given its Case ID)."};
  const name = String((d && d.name) || "").trim();
  if(!name) return {ok: false, error: "Write the file name first."};
  const bytes = d && d.bytes;
  if(!(bytes instanceof ArrayBuffer) || !bytes.byteLength) return {ok: false, error: "The document did not reach this step. Build it again."};
  if(!CATEGORIES.includes(d.category)) return {ok: false, error: `"${d.category}" is not a Doc Hub category. The categories are: ${CATEGORIES.join(", ")}.`};
  // taken before the original is handed to the CMS: transferring it empties it here
  const forDrive = bytes.slice(0);
  const out = await askCms({lsh: "cms-doc-file", name, category: d.category, original: d.original || name,
    mime: d.mime || "application/pdf", summary: d.summary || name, bytes}, "cms-doc-filed", [bytes]);
  if(!out || !out.ok) return out;
  return Object.assign({}, out, {drive: await keepOnDrive(d.folder, out.name, forDrive)});
}

/* A copy of a filed document on the trainee's Backup Drive (js/cm-drive.js), in the folder its kind belongs
   in. Never throws and never changes the filing: it reports, and the caller tells the trainee. */
async function keepOnDrive(folder, name, bytes){
  if(!folder) return {ok: false, why: "no-folder-given"};
  if(!window.CMDrive || typeof CMDrive.saveFiled !== "function") return {ok: false, why: "no-drive"};
  try{ return await CMDrive.saveFiled(folder, name, bytes); }
  catch(err){ return {ok: false, why: (err && err.message) || "the copy could not be made"}; }
}

/* How healthy the repository is: what has been filed, and what was filed right the first time. */
function health(){
  const all = Object.values(log());
  return {filed: all.filter(x=>x.filed).length, firstTime: all.filter(x=>x.filed && x.attempts === 1).length,
          attempts: all.reduce((n, x)=>n + (x.attempts || 0), 0)};
}
window.cmDocFiling = {panel, file, send, keepOnDrive, health, categories: CATEGORIES, expectedCategory, CATEGORIES, relayOrigins: ()=> RELAY_ORIGINS.map(String)};

/* ---------- relaying a simulator's document to the CMS ----------
   The LSH Training Portal (and a local server while the checks run) may ask; nobody else. The message
   is the CMS's own cms-doc-file, so the simulator speaks to the CMS through this course without either
   side learning anything new, and the answer goes back to the window that asked. */
const RELAY_ORIGINS = [
  /^https:\/\/([a-z0-9-]+\.)?cm-training-activity\.pages\.dev$/,
  /^https:\/\/([a-z0-9-]+\.)*legalsupporthelp\.workers\.dev$/,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
];
const mayRelay = (origin)=> RELAY_ORIGINS.some(re=> re.test(String(origin || "")));
window.addEventListener("message", (e)=>{
  const d = e.data;
  if(!d || d.lsh !== "cms-doc-file" || !mayRelay(e.origin)) return;
  const back = (out)=>{ try{ (e.source || window).postMessage(Object.assign({lsh:"cms-doc-filed", id:d.id, problems:[]}, out), e.origin); }catch(err){ /* that window went away */ } };
  const bytes = d.bytes instanceof ArrayBuffer ? d.bytes : null;
  if(!bytes || !bytes.byteLength){ back({ok:false, error:"The document did not arrive at the course. Try filing it again."}); return; }
  askCms({lsh:"cms-doc-file", name:d.name, category:d.category, original:d.original || d.name,
          mime:d.mime || "application/pdf", summary:d.summary || d.name, bytes}, "cms-doc-filed", [bytes])
    .then(out=>{
      back(out && typeof out === "object" ? {ok:!!out.ok, name:out.name, key:out.key, category:out.category, saved:out.saved, problems:out.problems || [], expected:out.expected, error:out.error}
                                          : {ok:false, error:"The CMS did not answer."});
      if(out && out.ok && typeof toast === "function") toast(`Filed in the CMS as ${out.name}.`);
    })
    .catch(err=> back({ok:false, error:(err && err.message) || "The document could not be sent to the CMS."}));
});

/* the trainee's filing comes back with their record (storeGet is ready once the page has loaded) */
window.addEventListener("load", ()=>{
  setTimeout(async ()=>{
    if(typeof storeGet !== "function") return;
    try{ const v = await storeGet(KEY); if(v && typeof v === "object"){ state.docFiling = v; if(typeof render === "function") render(); } }catch(e){}
  }, 320);
});
})();
