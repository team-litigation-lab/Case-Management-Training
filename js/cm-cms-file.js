/* 🗂 The CMS Case File grade: John Doe's file in the CMS, graded inside the platform, day by day.

   The trainee builds John Doe's case file in the CMS (js/cm-cms-case.js tells the course which case is open, with its
   client and Date of Loss; js/cm-doc-filing.js files each case document into it through the CMS's own name check). This
   file grades that file at each stage of the case from what the platform already receives, against a rubric of what a
   correct CMS file holds by then:

     🗂 Case opened & verified       Day 1: the CMS Case ID logged on Check Your Work, the CMS reporting the case open
                                     (course-bridge.js), the client John Doe, the Date of Loss entered, the ID logged
                                     being the case in the CMS
     👥 Parties & Conflict Check     the Check Your Work items of the activities worked in CMS → New Case / Parties
     🛡 Insurance stack & claims     … in CMS → Insurance tab (the stack, its limits, policy and claim numbers)
     📅 SOL, calendar & tasks        … in CMS → Calendar / Tasks (the SOL and every deadline docketed, tasks owned and dated)
     🗒 Case notes & logs            … in CMS → Case Notes / Communications Log / Case Summary / Case File
     💵 Liens & ledger               … in CMS → Liens / Financial Ledger
     ⚖️ Litigation record            … in CMS → Litigation / ADR
     📤 Documents filed              every case document of the day filed under its CMS category and named to the firm's
                                     convention (doc-filing: 100% first time right, then 100% ÷ the attempts it took)

   An activity's area is the CMS screen it is worked in first (its act.tool, "CMS → Insurance tab · …"). Its items
   are its Check Your Work list (the slide's checks, the ones the trainee ticks): ticked 100%, not ticked 0% once the
   activity is worked (answers revealed, a tick, or its work logged). An activity not worked, or a document not filed,
   is still to do while the day is open and counts 0 once the day's Knowledge Check is passed (the day is closed with
   that entry missing from the file). The Backup Drive activities are graded from the Drive itself (📂 Backup Drive).
   A day's grade is the average of its areas; the file's grade is the average of the days graded.

   What the CMS reported is kept on the trainee's own record (progress:<id>.data["cms-file"], a PERSONAL_KEY), so the
   trainer's view grades the same file: the trainee writes only their own progress data, as every auto-graded result.
   Shown: the trainee card (🏅 My Performance and the trainer's Scorecards: what is graded, what is missing), and the
   scorecard's 🗂 CMS Case File grading system (the trainee card, the Batch Sheet's columns, the CSV). */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const mean = a => a.length ? Math.round(a.reduce((n, x) => n + x, 0) / a.length) : null;
const AREAS = [
  {id: "open", icon: "🗂", label: "Case opened & verified", dim: "pc"},
  {id: "parties", icon: "👥", label: "Parties & Conflict Check", dim: "pc", re: /New Case|Parties/},
  {id: "ins", icon: "🛡", label: "Insurance stack & claim numbers", dim: "na", re: /Insurance/},
  {id: "cal", icon: "📅", label: "SOL, calendar & tasks", dim: "pc", re: /Calendar|Tasks/},
  {id: "notes", icon: "🗒", label: "Case notes & logs", dim: "cd", re: /Case Notes|Communications Log|Case Summary|Case Status|Case File|Onboarding/},
  {id: "liens", icon: "💵", label: "Liens & ledger", dim: "cp", re: /Liens|Financial Ledger/},
  {id: "lit", icon: "⚖️", label: "Litigation record", dim: "cp", re: /Litigation|ADR/},
  {id: "docs", icon: "📤", label: "Documents filed (category & name)", dim: "pc", re: /Documents/}];
const AREA = Object.fromEntries(AREAS.map(a => [a.id, a]));
const cfDays = () => (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d.cf);
const strip = t => String(t || "").replace(/\*\*(.+?)\*\*/g, "$1");
const masked = t => String(t || "").replace(/\*\*(.+?)\*\*/g, "▢▢▢");

/* the rubric: each Case Flow day's CMS activities (their area and Check Your Work items) and its case documents */
let PLAN = null;
function plan(){
  if(PLAN) return PLAN;
  const CF = window.CM_CASE_FLOW, SL = window.CM_CF_SLIDES || {}, DOCS = window.CM_CF_DOCS || [], PK = window.CM_CF_DOC_PACKETS || {};
  if(!CF || !CF.days) return {days: {}};
  const taught = {}; (CF.sequence || []).forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(b => { taught[b] = sd.n; })));
  const days = {}; const day = n => (days[n] = days[n] || {acts: [], docs: []});
  CF.days.forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => {
    if(b.kind !== "activity" || !b.act || /-drive$/.test(b.id)) return;
    const screens = String(b.act.tool || "").match(/CMS → [^·;]*/g); if(!screens) return;
    const first = screens[0], area = AREAS.find(a => a.re && a.re.test(first)) || AREA.notes;
    const checks = (SL[b.id] && SL[b.id].checks) || (b.act.checkpoints || []).slice(0, 5);
    day(taught[b.id] || d.n).acts.push({id: b.id, title: b.title, area: area.id, screen: first.replace(/^CMS → /, "").trim(), checks});
  })));
  const inPacket = new Set(); Object.values(PK).forEach(ids => (ids || []).forEach(id => inPacket.add(id)));
  DOCS.forEach(x => { if(x.day && inPacket.has(x.id) && !x.amends && !x.unlock) day(x.day).docs.push({id: x.id, title: x.title, cms: x.cms}); });
  return (PLAN = {days});
}

/* the grade, from a trainee's records: c = {rec, cf, data} as the scorecard reads them (js/cm-scorecard.js ctxOf) */
function compute(c){
  const P = plan(), data = (c && c.data) || {}, R = data["case-flow"] || {}, rec = (c && c.rec) || {}, cfd = ((c && c.cf) || {}).days || {};
  const ticks = R.ticks || {}, work = R.work || {}, rev = R.revealed || {}, filing = data["doc-filing"] || {}, cms = data["cms-file"] || {};
  // 🤖 the AI Grader's score of an activity (js/cm-ai-grader.js), which took the place of the Check Your Work ticks
  const ai = (data["cf-ai-grades"] || {}).blocks || {}, aiScore = id => ai[id] && typeof ai[id].score === "number" ? ai[id].score : null;
  const closed = n => { const d = cfDays().find(x => x.cf.n === n); const p = d ? ((rec.dayProgress || {})[d.id] || {}) : {}; return !!(p.done || (cfd[n] || {}).passed); };
  const reached = n => { const d = cfDays().find(x => x.cf.n === n); return closed(n) || !!(d && (rec.dayProgress || {})[d.id]) || (P.days[n] || {acts: []}).acts.some(a => worked(a.id)); };
  // an activity worked: a Check Your Work tick, its answers revealed, its work logged, or its own exercise done (the
  // voicemail transcribed, the Listening Check handed in, the call taken), as the Case Flow counts it (actDone)
  const worked = id => aiScore(id) != null || ((ticks[id] || []).some(Boolean)) || !!rev[id] || !!(work[id] && work[id].ref) || !!((R.notes || {})[id] || {}).txAt || !!((R.listen || {})[id] || {}).at || !!(R.calls || {})[id];
  const days = cfDays().map(d => {
    const n = d.cf.n, pl = P.days[n] || {acts: [], docs: []}, shut = closed(n), areas = {};
    const put = (aid, it) => { (areas[aid] = areas[aid] || []).push(it); };
    if(n === 1){
      const logged = Object.values(work).find(w => w && w.tool === "cms" && w.ref), ref = logged ? String(logged.ref).trim() : "";
      const id = String(cms.caseId || "").trim(), client = String(cms.client || "");
      const item = (name, ok, yes, no, pend) => put("open", ok == null ? {name, pct: null, pending: true, note: pend} : {name, pct: ok ? 100 : 0, note: ok ? yes : no});
      const due = shut || worked("d1m1-open");
      item("CMS Case ID logged on the Submit slide", ref ? true : due ? false : null, `Logged: ${ref}`, "No CMS Case ID logged", "Log it on the first CMS activity's Submit slide");
      item("The CMS reported your case open", id ? true : due ? false : null, `${id}${cms.at ? " · last heard " + new Date(cms.at).toLocaleDateString() : ""}`, "The CMS never reported a case: open your own case in 🗂 Open CMS", "Open your own case in the CMS beside the lesson");
      if(id){
        item("Client recorded as John Doe", /\bjohn\b/i.test(client) && /\bdoe\b/i.test(client), `Client: ${client}`, `The CMS has the client as "${client || "blank"}"`);
        item("Date of Loss entered", !!cms.dol, `Date of Loss ${cms.dol}`, "No Date of Loss in the CMS case");
        if(ref) item("The Case ID logged is the case in the CMS", ref === id, "They match", `Logged ${ref}, the CMS has ${id}`);
      }
    }
    pl.acts.forEach(a => { const w = worked(a.id), t = ticks[a.id] || [];
      a.checks.forEach((ck, j) => {
        const base = {block: a.id, act: a.title, screen: a.screen, text: ck, revealed: !!rev[a.id]};
        if(w && !t.some(Boolean) && aiScore(a.id) != null) put(a.area, Object.assign(base, {pct: aiScore(a.id), note: `Graded: ${aiScore(a.id)}/100`}));
        else if(w) put(a.area, Object.assign(base, {pct: t[j] ? 100 : 0, note: t[j] ? "Checked off on Check Your Work" : "Not checked off: the file doesn't hold it yet"}));
        else if(shut) put(a.area, Object.assign(base, {pct: 0, unworked: true, note: "Activity not worked: the day closed without this entry"}));
        else put(a.area, Object.assign(base, {pct: null, pending: true, note: "Still to do"}));
      }); });
    pl.docs.forEach(x => { const r = filing[x.id];
      if(r && r.filed) put("docs", {name: x.title, doc: x.id, pct: Math.round(100 / Math.max(1, r.attempts || 1)), note: `Filed as ${r.name || "named"} under ${r.category || x.cms} · ${(r.attempts || 1) === 1 ? "first time right" : r.attempts + " attempts"}`});
      else if(r && r.attempts > 0) put("docs", {name: x.title, doc: x.id, pct: 0, note: `Not filed: ${r.attempts} attempt${r.attempts === 1 ? "" : "s"} refused`});
      else if(shut) put("docs", {name: x.title, doc: x.id, pct: 0, note: `Not filed: the firm files it under ${x.cms}`});
      else put("docs", {name: x.title, doc: x.id, pct: null, pending: true, note: `To file under ${x.cms}`}); });
    const list = AREAS.filter(a => areas[a.id]).map(a => { const its = areas[a.id], sc = its.filter(i => i.pct != null);
      return {a, items: its, pct: mean(sc.map(i => i.pct)), graded: sc.length, missing: its.filter(i => i.pending || i.pct === 0).length}; });
    const g = list.filter(x => x.pct != null);
    return {n, d, closed: shut, reached: reached(n), areas: list, pct: mean(g.map(x => x.pct)), missing: list.reduce((s, x) => s + x.missing, 0)};
  });
  const g = days.filter(x => x.pct != null);
  return {days, pct: mean(g.map(x => x.pct)), graded: g.length};
}

/* ---------- the trainee card's section: what is graded, what is missing ---------- */
const tone = v => v == null ? "gs-na" : v >= 80 ? "gs-hi" : v >= 65 ? "gs-mid" : "gs-lo";
function itemName(i, me){ if(i.doc || i.name) return i.name; return me && !i.revealed ? masked(i.text) : strip(i.text); }
function html(res, me){
  if(!res || !res.days.some(x => x.reached || x.pct != null)) return "";
  const days = res.days.filter(x => x.reached || x.pct != null).map(x => {
    const miss = []; x.areas.forEach(ar => ar.items.filter(i => i.pending || i.pct === 0).forEach(i => miss.push({ar, i})));
    const areas = x.areas.map(ar => `<tr><td class="cmf-a">${ar.a.icon} ${E(ar.a.label)}</td><td class="cmf-v ${tone(ar.pct)}">${ar.pct == null ? "—" : ar.pct + "%"}</td>
      <td class="cmf-n">${ar.graded} graded${ar.missing ? ` · <b class="cmf-miss">${ar.missing} missing</b>` : " · complete"}</td></tr>`).join("");
    const ml = miss.slice(0, 40).map(({ar, i}) => `<li><b>${ar.a.icon} ${E(itemName(i, me))}</b> <span>${i.act ? E(`${i.act} · CMS → ${i.screen}`) + " · " : ""}${E(i.note)}</span></li>`).join("");
    return `<details class="cmf-day"${x.missing ? " open" : ""}><summary><b>Day ${x.n}</b> <span>${E(String(x.d.title).replace(/^Case Flow Day \d+ · /, ""))}</span>
        <em class="${tone(x.pct)}">${x.pct == null ? "not graded yet" : x.pct + "%"}</em><i>${x.missing ? `${x.missing} to add` : "✓ complete"}${x.closed ? "" : " · day open"}</i></summary>
      <table class="cmf-t"><tbody>${areas}</tbody></table>
      ${ml ? `<div class="cmf-todo"><b>${me ? "What your file is missing" : "What the file is missing"}</b><ul>${ml}</ul>${miss.length > 40 ? `<small>and ${miss.length - 40} more.</small>` : ""}</div>` : ""}</details>`; }).join("");
  return `<table class="bs-pt-t cmf-sec"><colgroup><col class="bs-pt-c1"><col class="bs-pt-c2"><col></colgroup><tbody>
    <tr class="bs-pt-sec"><th colspan="3">🗂 CMS Case File: John Doe's file in the CMS</th></tr>
    <tr><td class="bs-pt-m">The file's grade</td><td class="bs-pt-v ${tone(res.pct)}">${res.pct == null ? "—" : res.pct + "%"}</td>
      <td class="bs-pt-f">The average of ${res.graded} day${res.graded === 1 ? "" : "s"} graded. Each day is graded against what a correct CMS file holds by then: the case opened and verified, the parties and Conflict Check, the insurance stack and claim numbers, the SOL and every deadline calendared, the case notes and logs, the liens and ledger, the litigation record, and every document filed under its category and named to convention. An entry not made counts 0 once the day is passed.${me ? " Answers stay hidden (▢▢▢) until you finish the activity." : ""}</td></tr>
    <tr><td colspan="3" class="cmf-days">${days}</td></tr></tbody></table>`;
}

/* ---------- what the CMS reports is kept on the trainee's own record ---------- */
async function keep(c){
  if(typeof state === "undefined" || !state.traineeId || state.isAdmin || !c || !c.caseId || typeof storeSet !== "function") return;
  const cur = (typeof mem !== "undefined" && mem["cms-file"]) || (typeof storeGet === "function" ? await storeGet("cms-file").catch(() => null) : null) || {};
  if(cur.caseId === c.caseId && cur.client === c.client && (cur.dol || "") === (c.dol || "") && (cur.phase || "") === (c.phase || "")) return;
  const next = {caseId: c.caseId, client: c.client || "", dol: c.dol || "", phase: c.phase || "", at: new Date().toISOString(), firstAt: cur.firstAt || new Date().toISOString(),
    cases: Array.from(new Set((cur.cases || []).concat(c.caseId))).slice(-10)};
  try{ await storeSet("cms-file", next); }catch(e){}
}
function hook(){ if(window.CMCase && !hook.done){ hook.done = true; CMCase.onChange(keep); const c = CMCase.get(); if(c && Date.now() - (CMCase.heardAt() || 0) < 864e5) keep(c); } }
hook(); window.addEventListener("load", hook);

window.cmCmsFile = {AREAS, plan, compute, html, keep};

const css = document.createElement("style"); css.id = "cm-cms-file";
css.textContent = `
.cmf-sec{margin-top:14px;} .cmf-days{padding:6px 8px !important;}
.cmf-day{border:1px solid #C9D1E6;border-radius:10px;margin:6px 0;background:#fff;}
.cmf-day > summary{cursor:pointer;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;padding:9px 12px;font:600 15.5px 'Inter',Arial,sans-serif;color:#1E2340;list-style:none;}
.cmf-day > summary::-webkit-details-marker{display:none;} .cmf-day > summary b{font:800 16px 'Poppins','Inter',Arial,sans-serif;}
.cmf-day > summary em{font-style:normal;font-weight:800;padding:1px 10px;border-radius:999px;border:2px solid #C9D1E6;}
.cmf-day > summary em.gs-hi{background:#E6F4EA;border-color:#1E8E3E;color:#0B5D1E;} .cmf-day > summary em.gs-mid{background:#FFF4E0;border-color:#E8A400;color:#7A4B00;}
.cmf-day > summary em.gs-lo{background:#FDE8E8;border-color:#D93025;color:#A50E0E;} .cmf-day > summary em.gs-na{color:#475569;}
.cmf-day > summary i{font-style:normal;font-weight:700;font-size:14px;color:#B5651F;margin-left:auto;}
.cmf-day[open] > summary{border-bottom:1px solid #DDE1EC;}
.cmf-t{width:calc(100% - 20px);margin:8px 10px;border-collapse:collapse;font:600 15px 'Inter',Arial,sans-serif;}
.bs-pt .cmf-t td{border:1px solid #AEB6C6;padding:6px 9px;} .cmf-a{font-weight:800;color:#1E2340;width:45%;} .cmf-v{font-weight:800;width:90px;text-align:right;}
.cmf-v.gs-hi{background:#E6F4EA;color:#0B5D1E;} .cmf-v.gs-mid{background:#FFF4E0;color:#7A4B00;} .cmf-v.gs-lo{background:#FDE8E8;color:#A50E0E;} .cmf-v.gs-na{color:#5F6368;}
.cmf-n{color:#2E3450;} .cmf-miss{color:#A50E0E;}
.cmf-todo{margin:4px 10px 10px;padding:8px 12px;border-radius:8px;background:#FFF7E6;border:1px solid #F5D49A;font:600 14.5px/1.45 'Inter',Arial,sans-serif;color:#1E2340;}
.cmf-todo > b{font-weight:800;} .cmf-todo ul{margin:4px 0 0;padding-left:20px;} .cmf-todo li{margin:3px 0;} .cmf-todo li span{color:#475569;font-weight:600;} .cmf-todo small{font-size:14px;}
`;
document.head.appendChild(css);
})();
