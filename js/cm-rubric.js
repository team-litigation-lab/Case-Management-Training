/* 📐 The Feedback Rubric: ONE rubric for every piece of graded work in the course.

   The client's 100-point model has four dimensions, and every grade the course gives — automated or the trainer's —
   is read against the same four, in the same four tiers:
     ⏱ Procedural Compliance & Timeliness      25 points
     🔍 Needs Assessment & Risk Identification   25 points
     🗺 Care/Action Plan Quality                 30 points
     ✉️ Communication & Documentation            20 points
   Tiers (a score's share of its dimension's points): Exemplary 90–100% · Proficient 80–89% · Developing 65–79% ·
   Needs Improvement below 65%. Each dimension has a point band and a descriptor per tier (DIMS below), and the
   critical items (CRIT) form the safety gate: one breach fails the gate whatever the score.

   Where it is used:
     • 📐 Feedback Rubric page: Admin → 🏅 Scorecard → 📐 Feedback Rubric (trainers), and 🏅 My Performance →
       📐 Feedback Rubric (trainees). It shows the tiers, the descriptors, the critical items, and every grading system
       of the scorecard (js/cm-scorecard.js SOURCES) mapped to the dimensions it feeds and how it is scored.
     • the trainer's feedback composer (👥 Trainee Audit → name → ✍ Write feedback, index.html renderFeedbackComposer):
       a tier and points per dimension, each tier's descriptor beside it, the critical items met / breached, the total
       out of 100. It is saved on that day's review in feedback:<id> (days[<day>].rubric), which only a trainer's save
       can keep: the Worker keeps a trainer's sent review as the trainer's (OWNED.feedback) and drops a rubric from a
       trainee's own auto-review (traineeWrite). A sent review's rubric counts on the scorecard as the trainer score
       (📐 Trainer Rubric, and each dimension in the 100-point model; a breach marked by the trainer is a safety-gate breach).
   Fonts 14px and up, bold, LSH navy and orange. */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const TIERS = [
  {n: 4, id: "ex", label: "Exemplary", min: 90, band: "90–100%"},
  {n: 3, id: "pr", label: "Proficient", min: 80, band: "80–89%"},
  {n: 2, id: "dv", label: "Developing", min: 65, band: "65–79%"},
  {n: 1, id: "ni", label: "Needs Improvement", min: 0, band: "below 65%"}];
const tierOf = pct => pct == null ? null : TIERS.find(t => pct >= t.min);
const DIMS = [
  {id: "pc", icon: "⏱", label: "Procedural Compliance & Timeliness", w: 0.25, pts: 25,
    what: "Doing each step the firm's way, in its order and inside its window.",
    desc: {
      ex: "Every step in the firm's order and inside its window: the Conflict Check before the matter exists, the SOL and every deadline docketed with reminders, each document filed under the right CMS category and named to convention the first time, every task, random task and call answered on time.",
      pr: "Procedures followed with minor slips that are caught and fixed (a second try at a file name, a follow-up set a day late); no deadline missed and the day's deliverables done.",
      dv: "The procedure is known but applied unevenly: several refused filings, follow-ups without dates, random tasks or injected calls answered after their window; the day's deliverables need prompting.",
      ni: "Steps skipped or out of order: deadlines not docketed or missed, documents left unfiled or misfiled, tasks and calls missed, the day's deliverables not handed in."}},
  {id: "na", icon: "🔍", label: "Needs Assessment & Risk Identification", w: 0.25, pts: 25,
    what: "Finding what the file needs and what could hurt it, from its documents.",
    desc: {
      ex: "Finds every planted issue unprompted and names its risk from the source: treatment gaps, coverage and lien errors, privilege, the hard dates, the client's own needs; flags each to the attorney the same day, with its document.",
      pr: "Catches the material risks and records them with sources; at most a minor one missed or flagged late.",
      dv: "Catches the obvious issues but misses those that need documents cross-checked; flags without a source, or late; asks leading questions.",
      ni: "Misses material risks (a gap, a coverage error, a privileged document, a deadline) or records opinions in place of facts."}},
  {id: "cp", icon: "🗺", label: "Care/Action Plan Quality", w: 0.30, pts: 30,
    what: "A plan that moves the case: complete, sequenced, owned, dated and right.",
    desc: {
      ex: "The plan is complete and sequenced, every action has an owner, a date and a way to verify it; the figures (the stack, the specials, the Net Sheet) are right; it stays inside the Case Manager's role, with every decision routed to Atty. Thorne.",
      pr: "A workable plan with minor gaps (a step without a date, a figure to recheck), corrected when pointed out; inside the role.",
      dv: "A partial plan: steps without owners or dates, the order of work unclear, a figure wrong; needs the trainer to finish it.",
      ni: "Key steps missing, wrong figures relied on, or the plan crosses into legal advice or decisions that are the attorney's."}},
  {id: "cd", icon: "✉️", label: "Communication & Documentation", w: 0.20, pts: 20,
    what: "Saying it clearly, and leaving a record anyone can pick up.",
    desc: {
      ex: "Calls BLUF, calm and client-centred; emails say all they must and nothing they mustn't, accepted on the first draft; every contact logged with date, time, channel and outcome; transcripts and case notes accurate and complete.",
      pr: "Clear, professional communication with minor omissions (a log entry without a channel, a second draft); notes usable by anyone on the team.",
      dv: "Messages need several drafts or leave out what they must say; logs and notes incomplete; transcripts miss facts that drive the plan.",
      ni: "Unclear or unprofessional messages, client details shared where they mustn't be, contacts not logged, notes missing."}}];
// a dimension's point band for a tier: [low, high]
const band = (d, t) => { const i = TIERS.indexOf(t), hi = i === 0 ? d.pts : Math.ceil(d.pts * TIERS[i - 1].min / 100) - 1; return [Math.ceil(d.pts * t.min / 100), hi]; };
// the safety gate's critical items (the same as the 100-point model's, js/cm-scorecard.js MODEL.CRIT)
const CRIT = [
  {id: "upl", label: "UPL: no legal advice", what: "No legal advice to the client or anyone else: what a claim is worth, whether to settle, what a law means for them. Questions like these go to Atty. Thorne.",
    auto: "The AI review of each day's takeaway (CM Self-Summary): Risk 0 is its UPL flag."},
  {id: "priv", label: "Privilege", what: "Privileged and confidential material (a privileged memo, the Master Case Summary, a claim-specific HIPAA authorization, a mediation statement) never goes where it mustn't.",
    auto: "The exhibit audits' privilege items: each must be called right."},
  {id: "date", label: "Hard dates", what: "The SOL, a demand's deadline, a lien notice's response window: docketed, with reminders, and never missed.",
    auto: "The exhibit audits' calendar items: each must be called right."},
  {id: "trust", label: "Trust money", what: "The trust account balances to the cent on the final disbursement and the litigated Net Sheet; nothing is paid out before it is.",
    auto: "The Net Sheet's trust-money stages: every check must pass."}];
const DIM_BY = Object.fromEntries(DIMS.map(d => [d.id, d]));

/* ---------- a trainer's rubric on a day's review: {dims: {pc: {pts}}, crit: {upl: "met"|"breach"}, total, at, by} ---------- */
function total(rb){
  if(!rb || !rb.dims) return null;
  const have = DIMS.filter(d => rb.dims[d.id] && typeof rb.dims[d.id].pts === "number");
  if(!have.length) return null;
  const got = have.reduce((n, d) => n + Math.max(0, Math.min(d.pts, rb.dims[d.id].pts)), 0), of = have.reduce((n, d) => n + d.pts, 0);
  return Math.round(100 * got / of);
}
// only a trainer's review counts: the Worker keeps it as the trainer's (worker.js isTrainerReview), a trainee's own
// auto-review never passes for one, and a draft hasn't reached the trainee yet
const counts = v => !!(v && typeof v === "object" && v.status === "sent" && (v.editedByTrainer || !v.auto) && v.rubric && v.rubric.dims);

/* ---------- the composer: a tier and points per dimension, the critical items, the total ---------- */
function composerHtml(sid, rb){
  rb = rb || {}; const dims = rb.dims || {}, crit = rb.crit || {};
  const rows = DIMS.map(d => { const v = dims[d.id] && typeof dims[d.id].pts === "number" ? dims[d.id].pts : null, t = v == null ? null : tierOf(100 * v / d.pts);
    return `<div class="rbc-dim" data-dim="${d.id}"><div class="rbc-dh"><b>${d.icon} ${E(d.label)}</b><span class="rbc-w">${d.pts} pts</span>
        <label class="rbc-pts">Points <input type="number" min="0" max="${d.pts}" step="1" id="rbc_${sid}_${d.id}" value="${v == null ? "" : v}" oninput="cmRubric.input('${sid}')" aria-label="${E(d.label)}: points out of ${d.pts}"> / ${d.pts}</label></div>
      <div class="rbc-tiers" role="radiogroup" aria-label="${E(d.label)}: tier">${TIERS.map(x => { const [lo, hi] = band(d, x);
        return `<button type="button" role="radio" aria-checked="${t === x}" class="rbc-t rbc-${x.id}${t === x ? " on" : ""}" onclick="cmRubric.pick('${sid}','${d.id}','${x.id}')" title="${E(x.label)}: ${lo}–${hi} of ${d.pts}"><b>${E(x.label)}</b><small>${lo}–${hi}</small></button>`; }).join("")}</div>
      <p class="rbc-desc" id="rbcd_${sid}_${d.id}">${t ? `<b>${E(t.label)}:</b> ${E(d.desc[t.id])}` : `Pick a tier: its descriptor shows here. ${E(d.what)}`}</p></div>`; }).join("");
  const cr = CRIT.map(k => `<label class="rbc-crit"><span><b>${E(k.label)}</b> ${E(k.what)}</span><select id="rbcc_${sid}_${k.id}" onchange="cmRubric.input('${sid}')">
      ${[["", "Not observed"], ["met", "✓ Met"], ["breach", "⛔ Breach"]].map(([v, l]) => `<option value="${v}" ${(crit[k.id] || "") === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>`).join("");
  return `<div class="rbc" id="rbc_${sid}"><div class="rbc-head"><b>📐 Rubric score</b><span>The course's Feedback Rubric: a tier and points per dimension. Sent with the review, it counts on the trainee's scorecard as the trainer score.</span>
      <a href="#" onclick="cmRubric.open();return false" class="rbc-link">Open the full rubric ↗</a></div>
    ${rows}
    <div class="rbc-crits"><b>⛔ Safety gate: critical items</b><small>A breach fails the safety gate whatever the score.</small>${cr}</div>
    <div class="rbc-total" id="rbct_${sid}">${totalHtml(rb)}</div></div>`;
}
function totalHtml(rb){
  const t = total(rb), x = tierOf(t), br = CRIT.filter(k => rb && rb.crit && rb.crit[k.id] === "breach");
  if(t == null) return `<span>Total: <b>—</b> / 100</span><small>Score at least one dimension to count it on the scorecard.</small>`;
  const got = DIMS.reduce((n, d) => n + ((rb.dims[d.id] && typeof rb.dims[d.id].pts === "number") ? rb.dims[d.id].pts : 0), 0);
  const of = DIMS.filter(d => rb.dims[d.id] && typeof rb.dims[d.id].pts === "number").reduce((n, d) => n + d.pts, 0);
  return `<span>Total: <b>${got} / ${of}</b> = <b>${t}%</b> · ${E(br.length ? "Needs Improvement (safety gate)" : x.label)}</span>${br.length ? `<small>⛔ ${br.map(k => E(k.label)).join(", ")}: a safety-gate breach.</small>` : ""}`;
}
function read(sid){
  const dims = {}, crit = {};
  DIMS.forEach(d => { const el = document.getElementById(`rbc_${sid}_${d.id}`); if(!el || el.value === "") return;
    const v = Math.max(0, Math.min(d.pts, Math.round(Number(el.value)))); if(isFinite(v)) dims[d.id] = {pts: v, tier: tierOf(100 * v / d.pts).label}; });
  CRIT.forEach(k => { const el = document.getElementById(`rbcc_${sid}_${k.id}`); if(el && el.value) crit[k.id] = el.value; });
  if(!Object.keys(dims).length && !Object.keys(crit).length) return null;
  const rb = {dims, crit}; rb.total = total(rb); return rb;
}
function input(sid){
  const rb = read(sid) || {dims: {}, crit: {}};
  DIMS.forEach(d => { const box = document.querySelector(`#rbc_${sid} .rbc-dim[data-dim="${d.id}"]`); if(!box) return;
    const v = rb.dims[d.id] ? rb.dims[d.id].pts : null, t = v == null ? null : tierOf(100 * v / d.pts);
    box.querySelectorAll(".rbc-t").forEach((b, i) => { const on = t === TIERS[i]; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    const p = document.getElementById(`rbcd_${sid}_${d.id}`); if(p) p.innerHTML = t ? `<b>${E(t.label)}:</b> ${E(d.desc[t.id])}` : `Pick a tier: its descriptor shows here. ${E(d.what)}`; });
  const el = document.getElementById(`rbct_${sid}`); if(el) el.innerHTML = totalHtml(rb);
}
// a tier picked: the points go to the top of its band (the trainer can lower them inside it)
function pick(sid, dim, tid){
  const d = DIM_BY[dim], t = TIERS.find(x => x.id === tid), el = document.getElementById(`rbc_${sid}_${dim}`); if(!d || !t || !el) return;
  const [lo, hi] = band(d, t), v = Number(el.value);
  el.value = el.value !== "" && v >= lo && v <= hi ? v : hi; input(sid);
}
function fill(sid, rb){
  rb = rb || {}; DIMS.forEach(d => { const el = document.getElementById(`rbc_${sid}_${d.id}`); if(el) el.value = rb.dims && rb.dims[d.id] && typeof rb.dims[d.id].pts === "number" ? rb.dims[d.id].pts : ""; });
  CRIT.forEach(k => { const el = document.getElementById(`rbcc_${sid}_${k.id}`); if(el) el.value = (rb.crit && rb.crit[k.id]) || ""; });
  input(sid);
}

/* ---------- the 📐 Feedback Rubric page ---------- */
const trainer = () => typeof state !== "undefined" && !!state.isAdmin && !state.adminPreview;
function pageHtml(opts){
  opts = opts || {};
  const S = (window.cmScorecard && cmScorecard.sources) || [];
  const grid = `<div class="rbp-wrap"><table class="rbp-t rbp-grid"><thead><tr><th>Dimension</th>${TIERS.map(t => `<th class="rbp-${t.id}">${t.n} · ${E(t.label)}<small>${E(t.band)}</small></th>`).join("")}</tr></thead>
    <tbody>${DIMS.map(d => `<tr><th scope="row"><b>${d.icon} ${E(d.label)}</b><span class="rbp-w">${Math.round(d.w * 100)}% · ${d.pts} pts</span><small>${E(d.what)}</small></th>
      ${TIERS.map(t => { const [lo, hi] = band(d, t); return `<td class="rbp-${t.id}"><b class="rbp-band">${lo}–${hi} pts</b>${E(d.desc[t.id])}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
  const crit = `<div class="rbp-wrap"><table class="rbp-t"><thead><tr><th>Critical item</th><th>What the rubric requires</th><th>How the course checks it</th></tr></thead><tbody>
    ${CRIT.map(k => `<tr><th scope="row">⛔ ${E(k.label)}</th><td>${E(k.what)}</td><td>${E(k.auto)} The trainer can also mark it met or breached on any day's review.</td></tr>`).join("")}</tbody></table></div>`;
  const map = `<div class="rbp-wrap"><table class="rbp-t rbp-map"><thead><tr><th>Grading system</th><th>What is graded</th><th>How it is scored</th>${DIMS.map(d => `<th class="rbp-dc" title="${E(d.label)}">${d.icon}<small>${E(d.label.split(" ")[0])}</small></th>`).join("")}</tr></thead><tbody>
    ${S.map(s => `<tr><th scope="row">${s.icon} ${E(s.label)}</th><td>${E(s.about)}</td><td>${E(s.how || "")}</td>${DIMS.map(d => `<td class="rbp-dc">${(s.dims || []).includes(d.id) ? `<b class="rbp-on" aria-label="feeds ${E(d.label)}">●</b>` : ""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const how = `<ol class="rbp-how">
    <li><b>Every score is a percentage, read in the same four tiers:</b> ${TIERS.map(t => `<b>${E(t.label)}</b> ${E(t.band)}`).join(" · ")}.</li>
    <li><b>The 100-point model</b> (the Scorecard pill): each Case Flow day's evidence is scored per dimension, the day = Σ weight × dimension (25 / 25 / 30 / 20), and the Final weighs the days by complexity (Day 1 × 1.0 · Days 2–3 × 1.15 · Days 4–5 × 1.3). Pass = Final ≥ 80% <b>and</b> the safety gate at 100%.</li>
    <li><b>The rubric profile</b> on each trainee card: every grading system's average, placed in the dimensions it feeds (● above), so each dimension shows how all of the trainee's graded work reads against it.</li>
    <li><b>The trainer score:</b> the trainer scores each dimension in points on a day's review (👥 Trainee Audit → the trainee → ✍ Write feedback). Once sent it counts in that day's dimensions, in 📐 Trainer Rubric, and a breach it marks fails the safety gate.</li></ol>`;
  const back = opts.back ? `<button type="button" onclick="${opts.back}">← Back to My Performance</button>` : "";
  return `<div class="scx-page scx-wide rbp-page"><div class="ft-banner scx-banner"><div><p class="ft-banner-k">Legal Support Help · Case Management Training</p><h2>📐 Feedback Rubric</h2>
      <p class="ft-banner-sub">One rubric for every graded piece of work: four dimensions, four tiers, the safety gate${trainer() ? " · the trainer's feedback composer scores with it" : ""}</p></div>
      <div class="ft-banner-ctl"><span class="gs-menu">${back}<button type="button" onclick="window.print()">🖨 Print</button></span></div></div>
    <div class="card rbp-card">
      <section class="rbp-sec"><h3>📏 The four dimensions and their tiers</h3><p class="rbp-note">Points out of 100: each tier's band in each dimension, and what work at that tier looks like.</p>${grid}</section>
      <section class="rbp-sec"><h3>⛔ The safety gate: critical items</h3><p class="rbp-note">100% is required: one breach is <b>Needs Improvement · safety gate</b> whatever the score.</p>${crit}</section>
      <section class="rbp-sec"><h3>🧮 Every grading system, mapped to the rubric</h3><p class="rbp-note">Each of the scorecard's grading systems, what it grades, how it is scored and the dimensions it feeds (●).</p>${map}</section>
      <section class="rbp-sec"><h3>🧾 How the scores come together</h3>${how}</section>
    </div></div>`;
}
function open(){
  if(trainer()){ if(typeof setAdminTab === "function"){ state.view = "admin"; setAdminTab("rubric"); } return; }
  state.scxRubric = true; if(typeof goto === "function") goto("scorecard"); else render();
}

window.cmRubric = {TIERS, DIMS, CRIT, tierOf, band, total, counts, composerHtml, read, input, pick, fill, pageHtml, open};

const css = document.createElement("style"); css.id = "cm-rubric";
css.textContent = `
.rbp-card{padding:6px 18px 18px;background:#fff;border:1px solid #DDE1EC;border-radius:12px;}
.rbp-sec{padding:14px 0 6px;border-top:1px solid #E1E3E1;} .rbp-sec:first-child{border-top:0;}
.rbp-sec h3{margin:0 0 4px;font:800 21px 'Poppins','Inter',Arial,sans-serif;color:#1E2340;}
.rbp-note{margin:0 0 10px;font:600 15px 'Inter',Arial,sans-serif;color:#2E3450;}
.rbp-wrap{overflow-x:auto;}
.rbp-t{border-collapse:collapse;width:100%;font:500 15px/1.45 'Inter',Arial,sans-serif;color:#1F2433;}
.rbp-t th,.rbp-t td{border:1px solid #9AA3B5;padding:9px 11px;text-align:left;vertical-align:top;}
.rbp-t thead th{background:#1E2340;color:#fff;font:800 15px 'Poppins','Inter',Arial,sans-serif;}
.rbp-t thead th small{display:block;font:700 14px 'Inter',Arial,sans-serif;color:#FDE68A;}
.rbp-t tbody th{font-weight:800;color:#1E2340;background:#F4F6FB;min-width:200px;} .rbp-t tbody th small{display:block;margin-top:4px;font:600 14px 'Inter',Arial,sans-serif;color:#475569;}
.rbp-w{display:inline-block;margin:4px 0 0;padding:0 8px;border-radius:999px;background:#FDF0E4;color:#A4470F;font:800 14px 'Inter',Arial,sans-serif;}
.rbp-grid td{min-width:190px;font-weight:600;} .rbp-band{display:block;font:800 15px 'Inter',Arial,sans-serif;margin-bottom:3px;}
.rbp-grid td.rbp-ex{background:#EAF6EE;} .rbp-grid td.rbp-ex .rbp-band{color:#0B5D1E;}
.rbp-grid td.rbp-pr{background:#F1F6FE;} .rbp-grid td.rbp-pr .rbp-band{color:#1E2340;}
.rbp-grid td.rbp-dv{background:#FFF6E6;} .rbp-grid td.rbp-dv .rbp-band{color:#7A4B00;}
.rbp-grid td.rbp-ni{background:#FDECEC;} .rbp-grid td.rbp-ni .rbp-band{color:#A50E0E;}
.rbp-map td{font-weight:600;} .rbp-map td:nth-child(2){min-width:180px;} .rbp-map td:nth-child(3){min-width:180px;} .rbp-map tbody th{min-width:170px;}
.rbp-dc{text-align:center !important;min-width:112px;padding-left:6px !important;padding-right:6px !important;} .rbp-t thead th.rbp-dc,.rbp-t thead th.rbp-dc small{white-space:nowrap;word-break:normal;overflow-wrap:normal;hyphens:none;}   /* the dimension's name on one line, never broken mid-word */ .rbp-t thead th.rbp-dc small{color:#fff;font-size:14px;} .rbp-on{color:#DB8437;font-size:20px;}
.rbp-how{margin:6px 0 0;padding-left:22px;font:600 15.5px/1.55 'Inter',Arial,sans-serif;color:#1F2433;} .rbp-how li{margin:6px 0;} .rbp-how b{color:#1E2340;}
/* the composer */
.rbc{margin:12px 0;padding:12px 14px;border:2px solid #C9D1E6;border-radius:12px;background:#F8FAFD;font-family:'Inter',Arial,sans-serif;}
.rbc-head{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;margin-bottom:8px;} .rbc-head b{font:800 17px 'Poppins','Inter',Arial,sans-serif;color:#1E2340;}
.rbc-head span{font:600 14px 'Inter',Arial,sans-serif;color:#2E3450;flex:1 1 300px;} .rbc-link{font:800 14px 'Inter',Arial,sans-serif;color:#B5651F;}
.rbc-dim{padding:8px 0;border-top:1px solid #DDE1EC;} .rbc-dim:first-of-type{border-top:0;}
.rbc-dh{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;} .rbc-dh b{font:800 15.5px 'Inter',Arial,sans-serif;color:#1E2340;}
.rbc-w{font:800 14px 'Inter',Arial,sans-serif;color:#A4470F;background:#FDF0E4;border-radius:999px;padding:0 8px;}
.rbc .rbc-pts,.rbc .rbc-crit{text-transform:none;letter-spacing:0;}
.rbc label.rbc-pts{margin-left:auto;font:700 14px 'Inter',Arial,sans-serif;color:#1E2340;display:inline-flex;flex-direction:row;gap:6px;align-items:center;}
.rbc-pts input{width:64px;font:800 15px 'Inter',Arial,sans-serif;padding:4px 6px;border:2px solid #9CA3BD;border-radius:6px;color:#1E2340;}
.rbc-tiers{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:6px 0;}
.rbc-t{border:2px solid #C9D1E6;background:#fff;border-radius:8px;padding:5px 6px;cursor:pointer;text-align:center;font-family:'Inter',Arial,sans-serif;color:#1E2340;}
.rbc-t b{display:block;font:800 14px 'Inter',Arial,sans-serif;} .rbc-t small{display:block;font:700 14px 'Inter',Arial,sans-serif;color:#475569;}
.rbc-t.on.rbc-ex{background:#E6F4EA;border-color:#1E8E3E;} .rbc-t.on.rbc-pr{background:#E8F0FE;border-color:#262B45;}
.rbc-t.on.rbc-dv{background:#FFF4E0;border-color:#E8A400;} .rbc-t.on.rbc-ni{background:#FDE8E8;border-color:#D93025;}
.rbc-t:focus-visible{outline:3px solid #DB8437;outline-offset:1px;}
.rbc-desc{margin:2px 0 0;font:600 14px/1.45 'Inter',Arial,sans-serif;color:#2E3450;} .rbc-desc b{color:#1E2340;}
.rbc-crits{margin-top:8px;padding-top:8px;border-top:2px solid #DDE1EC;} .rbc-crits > b{font:800 15.5px 'Inter',Arial,sans-serif;color:#1E2340;} .rbc-crits > small{margin-left:8px;font:600 14px 'Inter',Arial,sans-serif;color:#475569;}
.rbc label.rbc-crit{display:flex;flex-direction:row;gap:10px;align-items:center;justify-content:space-between;margin:6px 0;font:600 14px/1.4 'Inter',Arial,sans-serif;color:#2E3450;}
.rbc-crit b{color:#1E2340;} .rbc-crit select{font:800 14px 'Inter',Arial,sans-serif;padding:4px 6px;border:2px solid #9CA3BD;border-radius:6px;color:#1E2340;background:#fff;flex:0 0 auto;}
.rbc-total{margin-top:8px;padding:8px 12px;border-radius:8px;background:#1E2340;color:#fff;font:700 15.5px 'Inter',Arial,sans-serif;display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;}
.rbc-total b{color:#FDE68A;} .rbc-total small{font:700 14px 'Inter',Arial,sans-serif;color:#FFD9A8;}
@media(max-width:760px){ .rbc-tiers{grid-template-columns:1fr 1fr;} .rbc label.rbc-pts{margin-left:0;} .rbc label.rbc-crit{flex-direction:column;align-items:flex-start;} }
@media print{ .rbp-t thead th,.rbp-grid td{-webkit-print-color-adjust:exact;print-color-adjust:exact;} }
`;
document.head.appendChild(css);
})();
