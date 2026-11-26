/* ============================================================
   📋 COMPLIANCE AND PLATFORM UTILIZATION MONITORING, on a trainee's card in 🏅 Scorecard
   ------------------------------------------------------------
   The same section every LSH program's trainee scorecard carries (the Foundational Training's Batch Sheet has it first):
   a dark heading, then a row per measure: what it is, the count, and a box per item, ✓ or ✗, so a trainer sees at a glance
   whether the trainee is keeping up with the platform, above 📝 Send Progress (js/cm-send-progress.js).
     📂 Backup Drive      the trainee's Backup Drive (js/cm-drive.js): connected, the folder setup passed, the structure
                         built in their Drive, and every folder still there at the last check (index.html loadDriveReports)
     📚 Lesson decks      each Case Flow day's slides, gone through to the end (the day's slide-progress, as 📚 Lessons reads it)
     🕘 Last opened       the page they last had open (their last-view) and when
     ⏱ Last on the platform  their record's lastActive
   It only reads what the Scorecard already loaded (and the Drive reports, loaded once if they aren't yet): nothing is saved.
   ============================================================ */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const T0 = v => { const d = v ? new Date(v) : null; return d && isFinite(d) ? d : null; };
const DTF = new Intl.DateTimeFormat(undefined, {month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"});
const when = v => { const d = T0(v); return d ? DTF.format(d) : ""; };
const ago = v => { const d = T0(v); if(!d) return ""; const m = Math.round((Date.now() - d) / 60000);
  return m < 2 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} day${Math.round(m / 1440) === 1 ? "" : "s"} ago`; };
const days = () => (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d && d.cf);
const dayName = d => { const t = String(d.title || "").replace(/^\s*(Case Flow\s+)?Day\s+\d+\s*[·:–-]?\s*/i, "").trim(); return `Day ${d.cf.n}${t ? " · " + t : ""}`; };

// 📂 the trainee's Backup Drive report (index.html state.driveReports, loaded once for the page if it isn't yet)
let asked = false;
function driveRep(id){
  const reps = (typeof state !== "undefined" && state.driveReports) || {};
  // (only when the page hasn't loaded them at all: a report already here — the Worker's nightly grade — is never replaced)
  if(!reps[id] && !asked && !state.driveReportsAt && typeof loadDriveReports === "function" && !state.driveReportsLoading){
    asked = true;
    Promise.resolve(loadDriveReports()).then(() => { if(state.view === "admin" && typeof render === "function" && !(typeof isTyping === "function" && isTyping())) render(); }).catch(() => {});
  }
  return reps[id] || null;
}
// 📚 a Case Flow day's slides, gone through to the end (js/cm-batch-sheet.js slidesOf: the furthest slide reached, of the day's)
function deckDone(data, rec, d){
  const sp = data["slide-progress"] || {}, dp = data["day-progress"] || rec.dayProgress || {};
  let n = 0; try{ n = typeof buildDaySlides === "function" ? buildDaySlides(d).length : 0; }catch(e){ n = 0; }
  const reached = Math.min(n, (sp[d.id] || 0) + ((sp[d.id] || dp[d.id]) ? 1 : 0));
  return {ok: !!n && reached >= n, n, reached};
}
const box = (icon, label, ok, tip) => `<div class="ccm-it" title="${E(tip || label)}"><span class="ccm-ic">${icon}</span><span class="ccm-lb">${E(label)}</span><b class="ccm-mk ${ok ? "ok" : "no"}">${ok ? "✓" : "✗"}</b></div>`;
const row = (label, count, cls, detail) => `<tr><th scope="row">${E(label)}</th><td class="ccm-n ${cls || ""}">${count}</td><td>${detail}</td></tr>`;

function html(r){
  if(!r || !r.id) return "";
  const c = r.c || {}, rec = c.rec || {}, data = c.data || {};
  // 📂 Backup Drive
  const rep = driveRep(r.id);
  const dr = rep ? [
    ["🔗", "Connected", !!rep.connected, rep.connected ? `Connected${rep.email ? ": " + rep.email : ""}` : "Not connected yet"],
    ["🗂", "Folder setup passed", !!rep.passed, rep.passed ? "The folder setup passed" : rep.attempts ? `Not passed (${rep.attempts} attempt${rep.attempts === 1 ? "" : "s"})` : "Not submitted yet"],
    ["🏗", "Structure built", !!rep.builtAt, rep.builtAt ? "Built " + when(rep.builtAt) : "Not built in their Drive yet"],
    ["✅", "All folders present", !!(rep.checkedAt && !(rep.missing || []).length), rep.checkedAt ? ((rep.missing || []).length ? `${rep.missing.length} missing at the last check: ${rep.missing.join(", ")}` : "Every folder there at the last check, " + when(rep.checkedAt)) : "Not checked yet"]] : null;
  const drN = dr ? dr.filter(x => x[2]).length : null;
  // 📚 Lesson decks
  const ds = days().map(d => Object.assign({d}, deckDone(data, rec, d)));
  const dsN = ds.filter(x => x.ok).length;
  // 🕘 Last opened
  const lv = data["last-view"] || null, lvDay = lv && lv.view === "day" ? days().find(d => String(d.id) === String(lv.dayId)) : null;
  const lvWhat = !lv ? "" : lvDay ? `Day ${lvDay.cf.n}` : lv.view === "dashboard" ? "Dashboard" : String(lv.view || "").replace(/^\w/, ch => ch.toUpperCase());
  const tone = (n, of) => n == null ? "" : n >= of ? "ok" : n ? "mid" : "no";
  return `<div class="ccm"><table class="ccm-t"><thead><tr><th colspan="3">Compliance and Platform Utilization Monitoring</th></tr></thead><tbody>
    ${row("📂 Backup Drive", dr ? `${drN} / ${dr.length}` : "…", tone(drN, 4), dr ? `<div class="ccm-g">${dr.map(x => box(...x)).join("")}</div>` : `<small class="ccm-mu">${state.driveReportsLoading ? "Loading the Drive report…" : "No Backup Drive report yet."}</small>`)}
    ${row("📚 Lesson decks", `${dsN} / ${ds.length}`, tone(dsN, ds.length), `<div class="ccm-g">${ds.map(x => box("📖", dayName(x.d), x.ok, x.ok ? "Every slide gone through" : x.reached ? `Slide ${x.reached} of ${x.n}` : "Not opened yet")).join("")}</div>`)}
    ${row("🕘 Last opened", lvWhat ? E(lvWhat) : "—", "", lv && lv.at ? E(when(lv.at)) : `<small class="ccm-mu">Nothing opened yet</small>`)}
    ${row("⏱ Last on the platform", rec.lastActive ? E(ago(rec.lastActive)) : "—", "", rec.lastActive ? E(when(rec.lastActive)) : `<small class="ccm-mu">Not seen yet</small>`)}
  </tbody></table></div>`;
}

const st = document.createElement("style"); st.id = "cm-compliance-monitor"; st.textContent = `
.ccm{margin:14px 0;}
.ccm-t{width:100%;border-collapse:collapse;background:#fff;border:1px solid #C9CEDB;font-size:14px;}
.ccm-t thead th{background:#1E2340;color:#fff;text-align:left;padding:12px 14px;font-size:17px;font-weight:800;}
.ccm-t tbody th{text-align:left;vertical-align:top;padding:10px 12px;width:24%;color:#1E2340;border-top:1px solid #C9CEDB;}
.ccm-t td{vertical-align:top;padding:10px 12px;border-top:1px solid #C9CEDB;border-left:1px solid #C9CEDB;}
.ccm-n{font-weight:800;width:11%;white-space:nowrap;} .ccm-n.ok{background:#ECFDF3;} .ccm-n.mid{background:#FFF4E2;} .ccm-n.no{background:#FDECEC;}
.ccm-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));border:1px solid #C9CEDB;border-radius:10px;overflow:hidden;}
.ccm-it{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;text-align:center;border-right:1px solid #E1E4EC;border-bottom:1px solid #E1E4EC;font-size:12.5px;}
.ccm-ic{font-size:18px;} .ccm-lb{color:#2A2F4A;line-height:1.2;overflow-wrap:anywhere;}
.ccm-mk{display:inline-flex;align-items:center;justify-content:center;width:30px;height:26px;border-radius:7px;font-size:15px;}
.ccm-mk.ok{background:#DCF5E5;color:#137A3A;} .ccm-mk.no{background:#FCE1E1;color:#B42318;}
.ccm-mu{color:#5B6178;}
@media(max-width:600px){.ccm-t tbody th{width:auto;} .ccm-g{grid-template-columns:repeat(2,1fr);}}
`; document.head.appendChild(st);

window.cmCompliance = {html};
})();
