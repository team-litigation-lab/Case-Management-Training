/* 🎧 THE VOICEMAIL AS A TRANSCRIPTION ACTIVITY, FILED TO THE CMS AND THE BACKUP DRIVE (every voicemail Skill Activity)
   A voicemail activity's Your Task had two ways into the same 🎧 Listening Check: a "🎧 Listen to the voicemail" link in
   📂 Your Case and the "🎧 Take it down: Listening Check" button (js/cm-vm-transcribe.js). Now:
   · one button, 🎧 Transcription Activity (the link in Your Case is gone; its sentence says the same);
   · once the notes are checked, the check goes on to what a Case Manager does with a message taken down: 📄 the
     transcription becomes a document (a PDF: the caller, the date, each question and what the trainee wrote), named the
     firm's way and 📤 filed in the CMS under Case Files, which keeps it on the Backup Drive too (01 Intake & Retainer),
     through the same name check and upload as every filed document (js/cm-doc-filing.js cmDocFiling.send); and
     ✉ Email Simulator opens the Email Workspace beside the slide, for the follow-up the message calls for.
   What was filed is kept on the trainee's record (personal key "vm-filed"). Wraps window.renderLessonCard and
   cmCaseFlow.listen; loads after js/cm-vm-transcribe.js. */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || !window.cmCaseFlow) return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const SIM = () => window.CM_CF_SIM || {events: {}};
const PREF = "vm-filed", CATEGORY = "Case Files", FOLDER = "intake";
if(typeof registerPersonalKeys === "function") registerPersonalKeys([PREF]);
const vmOf = id => { const e = (SIM().events || {})[id]; return e && e.channel === "voicemail" && Array.isArray(e.listen) && e.listen.length ? e : null; };
const rec = id => (((typeof cmCaseFlow.record === "function" && cmCaseFlow.record()) || {}).listen || {})[id] || {};
let FILED = {};
(async () => { try{ const v = typeof storeGet === "function" ? await storeGet(PREF) : null; if(v && typeof v === "object") FILED = v; }catch(e){} })();
const save = () => { try{ if(typeof storeSet === "function") storeSet(PREF, FILED); }catch(e){} };

/* the slide: one button, 🎧 Transcription Activity */
if(typeof window.renderLessonCard === "function"){
  const __card = window.renderLessonCard;
  window.renderLessonCard = function(l){
    const html = __card.apply(this, arguments);
    const b = l && l.cf && l.cf.block; if(!b || b.kind !== "activity" || !vmOf(b.id)) return html;
    const t = document.createElement("template"); t.innerHTML = String(html);
    t.content.querySelectorAll(".cfx-yc .cfx-vm-link").forEach(n => n.remove());
    t.content.querySelectorAll(".cfx-yc .vmt-do").forEach(n => { n.innerHTML = n.innerHTML.replace(/the 🎧 Listening Check/, "the 🎧 Transcription Activity"); });
    t.content.querySelectorAll(".cfx-task-foot .vmt-go").forEach(n => { if(/listen\(/.test(n.getAttribute("onclick") || "")) n.textContent = "🎧 Transcription Activity"; });
    return t.innerHTML;
  };
}

/* the check: once the notes are checked, the next steps */
const __listen = cmCaseFlow.listen;
cmCaseFlow.listen = function(blockId){
  const r = __listen.apply(this, arguments);
  try{ paint(blockId); }catch(e){}
  return r;
};
function namePattern(){ return window.cmDocFiling && typeof cmDocFiling.namePattern === "function" ? cmDocFiling.namePattern({name: "x.pdf"}) : "<Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.pdf"; }
function paint(blockId){
  const card = document.querySelector(`#cf-vm .cf-vm-card[data-vm="${blockId}"]`); if(!card) return;
  const h = card.querySelector(".cf-vm-h b"); if(h) h.textContent = "🎧 Transcription Activity";
  const r = rec(blockId); if(!r.at || card.querySelector(".cf-vm-next")) return;
  const f = FILED[blockId];
  const box = document.createElement("section"); box.className = "cf-vm-next"; box.setAttribute("aria-label", "File the transcription");
  box.innerHTML = `<h4>📄 Next: your transcription goes on the file</h4>
    <p>Name it the firm's way, then file it: it goes into the CMS under <b>${E(CATEGORY)}</b> and is kept on your Backup Drive.</p>
    ${f ? `<p class="cf-vm-done">✓ Filed in the CMS as <b>${E(f.name)}</b>${f.drive ? " · kept on your Backup Drive" : ""}</p>` : `<div class="cf-vm-file">
      <input type="text" id="cfvmn_${E(blockId)}" placeholder="${E(namePattern())}" aria-label="File name" spellcheck="false">
      <button type="button" class="btn cf-vm-go" onclick="cmVmFile.file('${E(blockId)}')">📤 File in the CMS &amp; Backup Drive</button></div>
      <p class="cf-vm-msg" id="cfvmm_${E(blockId)}" aria-live="polite"></p>`}
    <div class="cf-vm-acts"><button type="button" class="btn cf-vm-mail" onclick="cmVmFile.email('${E(blockId)}')">✉ Email Simulator</button>
      <button type="button" class="btn cf-vm-cms" onclick="cmCaseFlow.tool('cms','${E(blockId)}')">🗂 LSH CaseWorX</button></div>`;
  const tx = card.querySelector(".cf-vm-tx"); if(tx) tx.before(box); else card.appendChild(box);
}
/* the transcription as a PDF: the caller, the date and time, each question and what the trainee took down */
function build(blockId){
  const e = vmOf(blockId), r = rec(blockId), {jsPDF} = window.jspdf || {};
  if(!e || !jsPDF) return null;
  const doc = new jsPDF({unit: "pt", format: "letter"}), W = 612, M = 54; let y = 64;
  const line = (t, o) => { o = o || {}; doc.setFont("helvetica", o.b ? "bold" : "normal"); doc.setFontSize(o.s || 11);
    doc.splitTextToSize(String(t), W - 2 * M).forEach(s => { if(y > 740){ doc.addPage(); y = 64; } doc.text(s, M, y); y += (o.s || 11) + 5; }); };
  line("Voicemail Transcription", {b: true, s: 18}); y += 4;
  line(`From: ${e.from || ""}`); line(`Received: ${e.date || ""}${e.time ? " · " + e.time : ""}`);
  line(`Taken down: ${new Date().toLocaleDateString()}`); y += 8;
  e.listen.forEach((x, j) => { line(`${j + 1}. ${x.q}`, {b: true}); line((r.answers || [])[j] || "(not taken down)"); y += 6; });
  try{ return doc.output("arraybuffer"); }catch(err){ return null; }
}
async function file(blockId){
  const el = document.getElementById("cfvmn_" + blockId), msg = document.getElementById("cfvmm_" + blockId);
  const say = h => { if(msg) msg.innerHTML = h; };
  const name = ((el && el.value) || "").trim();
  if(!name) return say("Write the file name first, the firm's way.");
  if(!window.cmDocFiling || typeof cmDocFiling.send !== "function") return say("Filing isn't available on this page.");
  const bytes = build(blockId); if(!bytes) return say("The document could not be built. Try again.");
  say("Filing…");
  const out = await cmDocFiling.send({name, category: CATEGORY, folder: FOLDER, original: "Voicemail-Transcription.pdf", mime: "application/pdf",
    summary: "Voicemail transcription: " + ((vmOf(blockId) || {}).from || ""), bytes});
  if(out && out.ok){
    FILED[blockId] = {name: out.name, at: new Date().toISOString(), drive: !!(out.drive && out.drive.ok)}; save();
    if(typeof toast === "function") toast(`Filed in the CMS as ${out.name}.`);
    const box = document.querySelector("#cf-vm .cf-vm-next"); if(box) box.remove(); paint(blockId); return;
  }
  const probs = (out && out.problems && out.problems.length) ? out.problems : [(out && out.error) || "The CMS did not file it."];
  say(`<b>Not filed.</b> ${probs.map(E).join(" · ")}`);
}
function email(blockId){ cmCaseFlow.listenClose(); cmCaseFlow.tool("email", blockId); }
window.cmVmFile = {file, email, build, paint, filed: () => FILED};

const st = document.createElement("style"); st.id = "cm-vm-file"; st.textContent = `
#cf-vm .cf-vm-next{margin:14px 0 0;padding:14px 16px;border:1px solid #EBDDC7;border-radius:14px;background:#FFFBF4;text-align:left;}
#cf-vm .cf-vm-next h4{margin:0 0 6px;font:800 18px/1.3 'Poppins','Inter',sans-serif;color:#1E2340;}
#cf-vm .cf-vm-next p{margin:0 0 8px;font:700 16px/1.45 'Inter',sans-serif;color:#2B3147;}
#cf-vm .cf-vm-file{display:flex;gap:8px;flex-wrap:wrap;}
#cf-vm .cf-vm-file input{flex:1 1 280px;min-width:0;font:700 16px/1.2 'IBM Plex Mono',monospace;padding:10px 12px;border:2px solid #C9D3EA;border-radius:10px;}
#cf-vm .cf-vm-go,#cf-vm .cf-vm-mail,#cf-vm .cf-vm-cms{font:800 16px/1 'Inter',sans-serif !important;padding:11px 16px !important;border-radius:10px !important;border:0 !important;}
#cf-vm .cf-vm-go{background:linear-gradient(180deg,#F3D7AE 0%,#E2B677 100%) !important;color:#1E2340 !important;}
#cf-vm .cf-vm-mail,#cf-vm .cf-vm-cms{background:#1E2340 !important;color:#fff !important;}
#cf-vm .cf-vm-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;}
#cf-vm .cf-vm-done{color:#166534 !important;}
#cf-vm .cf-vm-msg{min-height:1em;}
`;
document.head.appendChild(st);
})();
