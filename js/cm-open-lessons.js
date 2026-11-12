/* 🔓 Open Lessons (as Foundational Training's Admin → 📅 Open Lessons): the trainer opens a Case Flow day
   (DAYS ids 11–15, "Case Flow Day 1–5") for All batches or for one batch, or 👤 for one trainee.
   • settings:opendays = {all: [dayIds], batches: {"<batch key>": [dayIds]}}: everyone reads it (worker.js PUBLIC_READ),
     only a trainer writes it. Every form of a Batch ID (B100926, B10092026, B10092026-LSHTRAINEE-004) is one key; keys
     saved in an older form are merged on read.
   • 👤 Open for one trainee writes unlockedDays (+ unlockedDaysAt) on trainee:<id>, which trainees can't change
     (PROTECTED_TRAINEE_FIELDS); applyAdminUnlocks brings it to the trainee's page as state.adminUnlockedDays.
   • A trainee can open a Case Flow day when: the trainer opened it for their batch or all batches, or for them alone;
     or they passed the day before (CM's own rule: Day N−1's Knowledge Check at 70%); or they've already started it
     (a score or slides read: a day a trainee has started is never locked again). Case Flow Day 1 stays open to everyone,
     as in CM before (DAY1_WAITS below makes it wait for the trainer, as Foundational's Lesson 1 does).
   • The trainee's page reads settings:opendays once at first need, then in its once-a-minute check (checkSurpriseTask's
     one get-many), so it costs no extra request.
   • The admin tab: window.renderAdminOpenLessons() (Admin → 🔓 Open Lessons, tab id 'openlessons'); the top bar's
     🔓 Open Lessons button and each Trainee Audit row's 🔓 chip lead to it. */
(function(){
"use strict";
const KEY = "settings:opendays";
const DAY1_WAITS = false;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const cfDays = () => (window.CM_CASE_FLOW_DAYS || []).filter(d => d && d.cf);
const cfOf = id => cfDays().find(d => d.id === Number(id)) || null;
const label = id => { const d = cfOf(id); return d ? "Case Flow Day " + d.cf.n : "Day " + id; };
const shortTitle = d => String(d.title || "").replace(/^Case Flow Day \d+\s*·\s*/, "");
// one key per batch, whatever form its Batch ID is in (as Foundational's ftBatchKey; worker.js batchKey matches)
const okey = b => String((typeof batchShow === "function" && typeof canonicalBatch === "function" && canonicalBatch(b) && batchShow(b)) || (typeof canonicalBatch === "function" && canonicalBatch(b)) || b || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const nums = a => [...new Set((Array.isArray(a) ? a : []).map(Number).filter(n => cfOf(n) || (n >= 11 && n <= 15)))].sort((x, y) => x - y);
const merge = m => { const o = {}; Object.keys(m || {}).forEach(k => { const c = okey(k) || k; o[c] = nums([].concat(o[c] || [], (m || {})[k] || [])); if(!o[c].length) delete o[c]; }); return o; };
const shape = x => x && typeof x === "object" ? {all: nums(x.all), batches: merge(x.batches)} : {all: [], batches: {}};
const openFor = b => { const o = state.cmOpenDays || {}; return new Set([].concat(o.all || [], (o.batches || {})[okey(b)] || []).map(Number)); };
const isTrainee = () => !!state.traineeId && !state.isAdmin && !state.adminPreview;
const trainer = () => !!state.isAdmin && !state.adminPreview;
const say = m => { if(typeof toast === "function") toast(m); };

state.cmOpenDays = null;
let loading = null;
function take(v){
  if(v == null && state.cmOpenDays) return false;   // a server blip never closes a day
  const next = shape(v), ch = JSON.stringify(next) !== JSON.stringify(state.cmOpenDays);
  state.cmOpenDays = next; return ch;
}
const redraw = () => { if(["dashboard", "day", "practice", "casedocs", "roadmap"].includes(state.view) && !(typeof isTyping === "function" && isTyping()) && !document.querySelector(".overlay")) render(); };
const load = () => loading || (loading = sharedGetMany([KEY]).then(([v]) => { loading = null; if(take(v)) redraw(); }).catch(() => { loading = null; }));

/* ---------- who can open a Case Flow day (outermost; js/cm-case-flow.js's rule is "passed the day before") ---------- */
const __cf = window.dayUnlocked;
window.dayUnlocked = function(id){
  id = Number(id); const d = cfOf(id); if(!d) return __cf.apply(this, arguments);
  if(state.isAdmin || state.adminPreview) return true;
  if(d.cf.n === 1 && !DAY1_WAITS) return true;
  const p = (state.progress || {})[id];
  if(p && (p.done || typeof p.score === "number")) return true;              // been through it
  if(((state.slideProgress || {})[id] || 0) > 0) return true;                // started: never locked again
  if((state.adminUnlockedDays || []).map(Number).includes(id)) return true;  // 👤 opened for this trainee
  if(state.cmOpenDays === null && isTrainee()) load();                       // first read, once
  if(openFor(state.traineeBatch).has(id)) return true;                       // 📅 opened for the batch / all batches
  return d.cf.n > 1 && __cf.apply(this, arguments);                          // ⏭ passed the day before
};
if(typeof dayLockReason === "function"){
  const __reason = dayLockReason;
  dayLockReason = window.dayLockReason = function(id){
    const d = cfOf(id); if(!d) return __reason.apply(this, arguments);
    return d.cf.n === 1 ? "Your trainer opens Case Flow Day 1 when your batch starts it."
      : `Your trainer opens Case Flow Day ${d.cf.n} when your batch starts it, or pass the Case Flow Day ${d.cf.n - 1} Knowledge Check (70%) to open it now.`;
  };
}
// a #/day/N address opened in a new tab: wait for the open days before calling it locked
if(typeof window.openRouteFromHash === "function"){
  const __route = window.openRouteFromHash;
  window.openRouteFromHash = function(){
    const r = typeof parseRouteHash === "function" ? parseRouteHash() : null;
    if(r && r.view === "day" && cfOf(r.id) && isTrainee() && !state.cmOpenDays){
      load().then(() => { if(!__route()) goto("dashboard"); }); return true;
    }
    return __route.apply(this, arguments);
  };
}

/* ---------- the dashboard: a locked day's Start says why (a disabled button can't show a tooltip or a toast) ---------- */
if(typeof moduleCard === "function"){
  const __card = moduleCard;
  moduleCard = window.moduleCard = function(d){
    const html = __card.apply(this, arguments);
    if(!d || !cfOf(d.id) || dayUnlocked(d.id)) return html;
    const why = E(dayLockReason(d.id));
    return html.replace(/<button class="btn module-start-btn ([^"]*)" disabled(?:="[^"]*")? onclick="[^"]*">[^<]*<\/button>/,
      `<button type="button" class="btn module-start-btn $1 cm-ol-locked" aria-disabled="true" title="${why}" onclick="event.stopPropagation(); cmOpenLessons.why(${d.id})">🔒 Start</button>`);
  };
}

/* ---------- the trainer's top bar: 🔓 Open Lessons ---------- */
if(typeof renderTopbar === "function"){
  const __bar = renderTopbar;
  renderTopbar = window.renderTopbar = function(){
    const html = __bar.apply(this, arguments);
    if(!trainer()) return html;
    const on = state.view === "admin" && state.adminTab === "openlessons";
    const b = `<button type="button" class="nav-openlessons${on ? " active" : ""}" onclick="cmOpenLessons.go()" title="Open a Case Flow day for a batch, or for one trainee">🔓 Open Lessons</button>`;
    const i = html.indexOf('onclick="openAdmin()"'); if(i < 0) return html;
    const s = html.lastIndexOf("<button", i);
    return html.slice(0, s) + b + html.slice(s);
  };
}

/* ---------- Admin → 🔓 Open Lessons ---------- */
function knownBatches(){
  const m = new Map();
  (state.adminData || []).forEach(r => { const k = okey(r && r.batch); if(k && !m.has(k)) m.set(k, (typeof canonicalBatch === "function" && canonicalBatch(r.batch)) || String(r.batch).trim()); });
  Object.keys((state.cmOpenDays || {}).batches || {}).forEach(k => { if(!m.has(k)) m.set(k, (typeof canonicalBatch === "function" && canonicalBatch(k)) || k.toUpperCase()); });
  return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
}
const traineesOf = sel => (state.adminData || []).filter(r => r && r.id && r.approved && !r.archived && !r.rejected && (sel === "__all" || okey(r.batch) === sel))
  .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
const nameOf = r => (typeof cleanName === "function" ? cleanName(r.name) : r.name) || r.id;
let adminReading = false;
function ensureAdminData(){
  if(adminReading) return;
  const need = state.cmOpenDays === null, ledger = !state.adminData && !state.adminLoading;
  if(!need && !ledger) return;
  adminReading = true;
  Promise.all([
    need ? sharedGetStrict(KEY).then(v => { take(v); }).catch(() => { state.cmOdReadFailed = true; }) : null,
    ledger && typeof loadAdminLedgerQuiet === "function" ? loadAdminLedgerQuiet().catch(() => {}) : null
  ]).then(() => { adminReading = false; if(state.view === "admin" && state.adminTab === "openlessons" && !(typeof isTyping === "function" && isTyping())) render(); });
}
function tile(d, st, cap, fn){
  return `<label class="ft-od-day${st.on ? " on" : ""}${st.dis ? " via" : ""}"><input type="checkbox" ${st.on ? "checked" : ""} ${st.dis ? "disabled" : ""} onchange="${fn}(${d.id}, this.checked)">
    <span><b>${E(label(d.id))}</b>${E(shortTitle(d))}${cap ? `<small>${E(cap)}</small>` : ""}</span></label>`;
}
window.renderAdminOpenLessons = function(){
  if(!trainer()) return "";
  ensureAdminData();
  const o = state.cmOpenDays;
  const batches = knownBatches();
  let sel = state.cmOdBatch || "__all";
  if(sel !== "__all" && !batches.some(([k]) => k === sel)) batches.push([sel, (typeof canonicalBatch === "function" && canonicalBatch(sel)) || sel.toUpperCase()]);
  const selName = sel === "__all" ? "All batches" : "batch " + ((batches.find(([k]) => k === sel) || [])[1] || sel);
  const all = new Set((o && o.all) || []), mine = new Set(sel === "__all" ? [] : ((o && o.batches) || {})[sel] || []);
  const banner = `<div class="cm-ol-banner"><div><p>Open Lessons</p><h2>🔓 Open Lessons</h2><span>${sel === "__all" ? "Every batch" : "Batch " + E(selName.replace(/^batch /, ""))} · Case Flow Days 1–5</span></div></div>`;
  if(!o){
    return banner + `<div class="card ft-open-days"><h3>📅 Open Lessons</h3><p class="cm-ol-help">${state.cmOdReadFailed ? "Couldn't read which days are open. Check your connection and refresh." : "Reading which days are open…"}</p></div>`;
  }
  const days = cfDays();
  const tiles = days.map(d => {
    if(sel !== "__all" && all.has(d.id)) return tile(d, {on: true, dis: true}, "open for all batches", "cmOpenLessons.toggleBatch");
    const on = sel === "__all" ? all.has(d.id) : mine.has(d.id);
    return tile(d, {on}, on ? (sel === "__all" ? "open for all batches" : "open for " + selName) : (d.cf.n === 1 && !DAY1_WAITS ? "always open" : "opens when they pass the day before"), "cmOpenLessons.toggleBatch");
  }).join("");
  // 👤 Open for one trainee
  const people = traineesOf(sel);
  let tid = state.cmOdTrainee || "";
  if(tid && !people.some(r => r.id === tid)) tid = "";
  const who = people.find(r => r.id === tid);
  const theirs = new Set(nums(who && who.unlockedDays));
  const batchOpen = who ? new Set([].concat([...all], ((o.batches || {})[okey(who.batch)] || []))) : new Set();
  const one = `<div class="ft-od-one"><h4>👤 Open for one trainee</h4>
    <p class="cm-ol-help">For a trainee who is behind or ahead of the batch: open a day for them alone. They see it within a minute.</p>
    <div class="ft-od-row"><label for="ftOdTrainee"><b>Trainee</b></label>
      <select id="ftOdTrainee" onchange="cmOpenLessons.setTrainee(this.value)"><option value="">${state.adminData ? (people.length ? "Pick a trainee…" : "No approved trainees" + (sel === "__all" ? "" : " in this batch")) : "Loading trainees…"}</option>
      ${people.map(r => `<option value="${E(r.id)}" ${r.id === tid ? "selected" : ""}>${E(nameOf(r))}${sel === "__all" && r.batch ? " · " + E(r.batch) : ""}</option>`).join("")}</select></div>
    ${who ? `<div class="ft-od-days">${days.map(d => batchOpen.has(d.id) ? tile(d, {on: true, dis: true}, "open for the batch", "cmOpenLessons.toggleTrainee")
      : tile(d, {on: theirs.has(d.id)}, theirs.has(d.id) ? "open for " + nameOf(who) : "", "cmOpenLessons.toggleTrainee")).join("")}</div>` : ""}
  </div>`;
  return banner + `<div class="card ft-open-days">
    <h3>📅 Open Lessons</h3>
    <p class="cm-ol-help">Tick a Case Flow day to open it for the batch picked (or for all batches). A day also opens by itself for a trainee who passes the day before's Knowledge Check, and a day a trainee has started stays open.</p>
    <div class="ft-od-row"><label for="ftOdBatch"><b>Batch</b></label>
      <select id="ftOdBatch" onchange="cmOpenLessons.setBatch(this.value)"><option value="__all" ${sel === "__all" ? "selected" : ""}>All batches</option>
      ${batches.map(([k, n]) => `<option value="${E(k)}" ${k === sel ? "selected" : ""}>${E(n)}</option>`).join("")}</select></div>
    <div class="ft-od-days">${tiles}</div>
    ${one}
  </div>`;
};

async function toggleBatch(id, on){
  if(!trainer()) return;
  let cur;
  try{ cur = await sharedGetStrict(KEY); }catch(e){ say("Couldn't read the open days: nothing was changed. Check your connection and try again."); render(); return; }
  const o = shape(cur), sel = state.cmOdBatch || "__all";
  const list = new Set(sel === "__all" ? o.all : (o.batches[sel] || []));
  if(on) list.add(Number(id)); else list.delete(Number(id));
  if(sel === "__all") o.all = nums([...list]);
  else { o.batches[sel] = nums([...list]); if(!o.batches[sel].length) delete o.batches[sel]; }
  if(!(await sharedSet(KEY, o))){ say("Not saved: check your connection and try again."); render(); return; }
  state.cmOpenDays = o;
  const name = sel === "__all" ? "all batches" : "batch " + ((typeof canonicalBatch === "function" && canonicalBatch(sel)) || sel.toUpperCase());
  say(`${label(id)} ${on ? "opened" : "closed"} for ${name}. Trainees see it within a minute.`);
  render();
}
async function toggleTrainee(id, on){
  if(!trainer()) return;
  const tid = state.cmOdTrainee; if(!tid) return;
  let rec;
  try{ rec = await sharedGetStrict("trainee:" + tid); }catch(e){ rec = null; }
  if(!rec){ say("Couldn't load that trainee: refresh and try again."); render(); return; }
  // only this Case Flow day changes: any other day already on the record stays
  const set = new Set((Array.isArray(rec.unlockedDays) ? rec.unlockedDays : []).map(Number).filter(n => Number.isFinite(n)));
  if(on) set.add(Number(id)); else set.delete(Number(id));
  rec.unlockedDays = [...set].sort((a, b) => a - b);
  rec.unlockedDaysAt = new Date().toISOString();
  if(!(await sharedSet("trainee:" + tid, rec))){ say("Not saved: check your connection and try again."); render(); return; }
  if(state.adminData){ const i = state.adminData.findIndex(r => r.id === tid); if(i !== -1) state.adminData[i] = rec; }
  say(`${label(id)} ${on ? "opened" : "closed"} for ${nameOf(rec)}. Their open page updates within a minute.`);
  render();
}
function go(batch, trainee){
  if(batch !== undefined) state.cmOdBatch = batch || "__all";
  if(trainee !== undefined) state.cmOdTrainee = trainee || "";
  state.adminTab = "openlessons"; goto("admin");
}

/* ---------- Trainee Audit row: a 🔓 chip that opens this trainee on Open Lessons ---------- */
if(typeof renderUnlockDaysControl === "function"){
  const __u = renderUnlockDaysControl;
  window.renderUnlockDaysControl = renderUnlockDaysControl = function(rec){
    const mine = nums(rec && rec.unlockedDays);
    const chip = rec && rec.id ? `<button type="button" class="btn btn-sm btn-ghost cm-ol-chip${mine.length ? " on" : ""}" title="Open a Case Flow day for this trainee, or for their batch" onclick="event.stopPropagation(); cmOpenLessons.go('${E(okey(rec.batch))}', '${E(rec.id)}')">🔓 ${mine.length ? "Opened for them: " + mine.map(n => { const d = cfOf(n); return d ? "CF Day " + d.cf.n : "Day " + n; }).join(", ") : "Open Lessons"}</button>` : "";
    return chip + __u.apply(this, arguments);
  };
}

/* ---------- a temporary hook so the tab works on its own: Admin → 🔓 Open Lessons (tab 'openlessons') ----------
   Used only while renderAdmin itself has no 'openlessons' tab: it adds the button to the tab row and draws the page. */
if(typeof window.renderAdmin === "function"){
  const __admin = window.renderAdmin;
  const btn = active => `<button class="admin-tab-btn ${active ? "active" : ""}" onclick="setAdminTab('openlessons')">🔓 Open Lessons</button>`;
  window.renderAdmin = function(){
    if(!state.isAdmin) return __admin.apply(this, arguments);
    const want = state.adminTab === "openlessons";
    let out = __admin.apply(this, arguments);
    if(out.includes("setAdminTab('openlessons')")) return out;   // renderAdmin has the tab (and draws it): nothing to add
    if(want){ state.adminTab = "rankings"; try{ out = __admin.apply(this, arguments); } finally{ state.adminTab = "openlessons"; } }
    const r = out.indexOf('<div class="cf-admin-row">');
    if(r < 0) return out;
    const end = out.indexOf("</div></div>", r); if(end < 0) return out;
    let row = out.slice(r, end);
    if(want) row = row.replace(/admin-tab-btn active/g, "admin-tab-btn");
    if(!want && !row.includes("setAdminTab('audit')")) return out;
    row += btn(want);
    // the open section's count (Admin Master Control's) takes the extra tab
    const pre = out.slice(0, r).replace(/(<button type="button" class="cf-admin-sec active"[^>]*>[^<]*<span>)(\d+)(<\/span>)/, (m, a, n, z) => a + (Number(n) + 1) + z);
    const head = pre + row + "</div></div>";
    return want ? head + window.renderAdminOpenLessons() : head + out.slice(end + 12);
  };
}

window.cmOpenLessons = {
  KEY, key: okey, shape, openFor, load,
  // the trainee's once-a-minute check reads the open days in its one get-many (checkSurpriseTask)
  keys: () => isTrainee() ? [KEY] : [],
  onKeys: ([v]) => { if(take(v)) redraw(); },
  toggleBatch, toggleTrainee, go,
  setBatch: v => { state.cmOdBatch = v || "__all"; state.cmOdTrainee = ""; render(); },
  setTrainee: v => { state.cmOdTrainee = v || ""; render(); },
  why: id => say("🔒 " + dayLockReason(id))
};

const css = document.createElement("style");
css.textContent = `
.ft-open-days{padding:22px 26px;margin-bottom:18px;font-size:16px;}
.ft-open-days h3{margin:0 0 6px;color:var(--navy);font-size:24px;font-family:'Poppins','Inter',sans-serif;}
.ft-open-days .cm-ol-help{margin:0 0 6px;font-size:15.5px;line-height:1.5;color:#3E4560;}
.ft-open-days .ft-od-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 0;}
.ft-open-days select{font:inherit;font-size:16px;font-weight:700;padding:8px 12px;border-radius:8px;border:2px solid #3B4A8C;color:#1E2340;background:#fff;max-width:100%;}
.ft-od-days{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:10px;}
.ft-od-day,.ft-od-day b{overflow-wrap:normal;word-break:normal;hyphens:none;}
.ft-od-day{display:flex;gap:10px;align-items:flex-start;border:2px solid var(--line);border-radius:12px;padding:14px;font-size:15px;line-height:1.4;color:#262B45;background:#fff;cursor:pointer;min-height:64px;}
.ft-od-day input[type=checkbox]{width:18px;height:18px;margin-top:2px;flex:0 0 auto;accent-color:#DB8437;}
.ft-od-day.on{border-color:var(--orange);background:#FFF6EC;}
.ft-od-day.via{cursor:default;}
.ft-od-day small{display:block;margin-top:4px;font-size:14px;font-weight:700;color:#A4470F;}
.ft-od-one{margin-top:16px;border-top:1px solid var(--line);padding-top:12px;}
.ft-od-one h4{margin:0 0 6px;font-size:18px;color:var(--navy);}
.ft-od-day b{display:block;color:var(--navy);font-weight:800;font-size:16px;}
.cm-ol-banner{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;background:linear-gradient(135deg,#1E2340,#262B45);color:#fff;border-radius:16px;padding:18px 22px;margin-bottom:14px;border-bottom:4px solid #DB8437;}
.cm-ol-banner p{margin:0;font:800 14px 'Inter',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#F6C08F;}
.cm-ol-banner h2{margin:4px 0;font:800 24px 'Poppins','Inter',sans-serif;color:#fff;}
.cm-ol-banner span{font:600 15px/1.5 'Inter',sans-serif;color:#E3E7F1;}
.cm-ol-chip.on{border-color:#DB8437 !important;background:#FFF6EC;color:#1E2340;}
button.module-start-btn.cm-ol-locked,
.dash-main .module-card.mc-clean .mc-grid > button.module-start-btn.cm-ol-locked,
.dash-main .module-card.mc-clean:hover .mc-grid > button.module-start-btn.cm-ol-locked:not(:disabled){background:#E4E7EF;color:#4A5068;cursor:not-allowed;border-color:#CDD1DE;}`;
document.head.appendChild(css);
})();
