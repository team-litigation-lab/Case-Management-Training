/* ============================================================
   📊 MY BATCH'S PROGRESS: what the trainer's 🏆 Rankings & Progress Report says about a trainee, on their own 🏅 Scorecard.

   A trainee can read only their own records (worker.js canRead), so the batch's numbers reach them the Foundational
   Training's way (its rankshare:<id>): each time a trainer has the Rankings & Progress Report open on one batch with every
   grade collected (js/cm-rankings.js current().ok), each trainee of it gets their own row, written to rankshare:<id> —
   which only that trainee and the trainers read, and only the trainers write (traineeWrite refuses it):
     {at, batch, rank, of, overall, result, strength, challenges, attrs, progress, passed, endorsement,
      days: [{n, me, avg}]}   (their day scores beside the batch's average for each Case Flow day)
   No other trainee's name or score is in it: the batch is only its average and how many are ranked. A row is written again
   only when it changed (the last one sent is remembered on this device).
   The trainee's 🏅 Scorecard (js/cm-scorecard.js renderMine) shows it under their card: their rank, each day against the
   batch average and the passing score, and their Strength, Challenges, General Attribute Rating and Progress.
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const fin = x => typeof x === "number" && isFinite(x);
const PASS = () => ((window.cmScorecard || {}).model || {}).PASS || 80;
const SENT_KEY = "cm-rankshare-sent";
let sent = {}; try{ sent = JSON.parse(localStorage.getItem(SENT_KEY) || "{}") || {}; }catch(e){ sent = {}; }
let busy = false, timer = 0;

/* ---------- the trainer's side: share each trainee's row when the report is complete ---------- */
function rowsToShare(cur){
  if(!cur || !cur.ok || !cur.label || cur.label === "All batches" || !cur.gen || !cur.gen.length) return [];
  const rows = cur.snap.rows, ns = [...new Set([].concat(...cur.gen.map(x => (x.dayS || []).map(d => d.n))))].sort((a, b) => a - b);
  const avg = n => { const v = cur.gen.map(x => ((x.dayS || []).find(d => d.n === n) || {}).S).filter(fin); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
  const avgs = Object.fromEntries(ns.map(n => [n, avg(n)])), of = cur.gen.filter(x => x.pct != null).length;
  return cur.gen.map((x, i) => { const r = rows[i] || {};
    return [x.id, {batch: cur.label, rank: x.pct == null ? null : Number(r.rank) || null, of, overall: r.overall, result: r.result, strength: r.strength,
      challenges: r.challenges, attrs: (r.attrs || []).map(a => ({label: a.label, stars: a.stars})), progress: r.progress, passed: r.passed, endorsement: r.endorsement,
      days: ns.map(n => ({n, me: fin(((x.dayS || []).find(d => d.n === n) || {}).S) ? (x.dayS.find(d => d.n === n)).S : null, avg: avgs[n]}))}]; });
}
async function share(){
  if(busy || !window.cmRankings || typeof sharedSet !== "function") return;
  let cur; try{ cur = cmRankings.current(); }catch(e){ return; }
  const todo = rowsToShare(cur).filter(([id, v]) => sent[id] !== JSON.stringify(v));
  if(!todo.length) return;
  busy = true;
  try{
    for(const [id, v] of todo){ const ok = await sharedSet("rankshare:" + id, Object.assign({at: new Date().toISOString()}, v)); if(ok !== false) sent[id] = JSON.stringify(v); }
    try{ localStorage.setItem(SENT_KEY, JSON.stringify(sent)); }catch(e){}
  }catch(e){ /* tried again the next time the report is drawn */ }
  busy = false;
}
if(window.cmRankings && typeof cmRankings.pageHtml === "function" && !cmRankings.pageHtml.__share){
  const __page = cmRankings.pageHtml;
  cmRankings.pageHtml = function(){ const html = __page.apply(this, arguments); clearTimeout(timer); timer = setTimeout(share, 1500); return html; };
  cmRankings.pageHtml.__share = true;
}

/* ---------- the trainee's side: 📊 My Batch's Progress on their 🏅 Scorecard ---------- */
const MY = {id: null, at: 0, v: undefined, loading: false};
function load(){
  const id = state.traineeId; if(!id || MY.loading || (MY.id === id && Date.now() - MY.at < 60000) || typeof sharedGet !== "function") return;
  MY.loading = true; MY.at = Date.now();
  Promise.resolve(sharedGet("rankshare:" + id)).then(v => { MY.id = id; MY.v = v && typeof v === "object" ? v : null; }).catch(() => { MY.id = id; MY.v = null; })
    .then(() => { MY.loading = false; if(state.view === "scorecard" && typeof render === "function") render(); });
}
function traineeHtml(){
  load();
  const v = MY.id === state.traineeId ? MY.v : undefined, P = PASS();
  const head = `<h3 class="rks-h">📊 My Batch's Progress</h3>`;
  if(v === undefined) return `<section class="rks scx-pad">${head}<p class="rks-note">Loading…</p></section>`;
  if(!v) return `<section class="rks scx-pad">${head}<p class="rks-note">Your batch's progress shows here once your trainer has opened the batch's Rankings &amp; Progress Report.</p></section>`;
  const when = v.at ? new Date(v.at).toLocaleDateString("en-US", {month: "short", day: "numeric"}) : "";
  const tone = x => !fin(x) ? "" : x >= P ? "gs-hi" : x >= 65 ? "gs-mid" : "gs-lo";
  const days = (v.days || []).filter(d => fin(d.me) || fin(d.avg));
  return `<section class="rks scx-pad">${head}
    <p class="rks-note">${E(v.batch || "")}${when ? ` · as of ${E(when)}` : ""} · only your own row: the batch is shown as its average.</p>
    <div class="rks-tiles"><div><span>My rank</span><b>${v.rank ? `#${v.rank}` : "—"}</b><small>${v.of ? `of ${v.of} ranked` : "not ranked yet"}</small></div>
      <div><span>Batch Score</span><b>${E(v.overall || "—")}</b><small>${E(v.result || "")}</small></div>
      <div><span>Progress</span><b>${E(v.passed || "—")}</b><small>${E(v.progress || "")}</small></div></div>
    ${days.length ? `<div class="rks-wrap"><table class="rks-t"><thead><tr><th>Day</th><th>Me</th><th>Batch average</th><th>Passing score</th></tr></thead><tbody>
      ${days.map(d => `<tr><th scope="row">Day ${E(d.n)}</th><td class="${tone(d.me)}">${fin(d.me) ? d.me + "%" : "—"}</td><td>${fin(d.avg) ? d.avg + "%" : "—"}</td>
        <td>${fin(d.me) ? (d.me >= P ? `✓ above ${P}%` : `${P - d.me} to go`) : `${P}%`}</td></tr>`).join("")}</tbody></table></div>` : ""}
    <div class="rks-wrap"><table class="rks-t rks-row"><thead><tr><th>Strength</th><th>Challenges</th><th>General Attribute Rating</th></tr></thead><tbody><tr>
      <td>${E(v.strength || "—")}</td><td>${E(v.challenges || "—")}</td>
      <td>${(v.attrs || []).map(a => `<span class="rks-a">${E(a.label)}</span><b class="rks-s">${E(a.stars)}</b>`).join("") || "—"}</td></tr></tbody></table></div>
  </section>`;
}

window.cmRankShare = {traineeHtml, rowsToShare, share, reload(){ MY.at = 0; load(); }};

const st = document.createElement("style"); st.id = "cm-rank-share"; st.textContent = `
.rks{margin-top:14px;border-top:2px solid #1E2340;padding-top:12px;}
.rks-h{margin:0 0 4px;font:800 19px Arial,sans-serif;color:#1E2340;} .rks-note{margin:0 0 10px;font:600 15px Arial,sans-serif;color:#3E4560;}
.rks-tiles{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;}
.rks-tiles>div{flex:1 1 180px;border:1px solid #DCE0EA;border-radius:10px;padding:10px 14px;background:#fff;}
.rks-tiles span{display:block;font:700 14px Arial,sans-serif;color:#5F6368;} .rks-tiles b{display:block;font:800 24px Arial,sans-serif;color:#1E2340;margin:2px 0;}
.rks-tiles small{font:700 14px Arial,sans-serif;color:#3E4560;}
.rks-wrap{overflow-x:auto;border:1px solid #DCE0EA;border-radius:10px;margin-bottom:12px;}
.rks-t{width:100%;border-collapse:collapse;font:600 15px/1.45 Arial,sans-serif;color:#141A2E;background:#fff;}
.rks-t thead th{background:#262B45;color:#fff;font-weight:800;text-align:left;padding:8px 12px;border-bottom:2px solid #DB8437;}
.rks-t td,.rks-t tbody th{padding:8px 12px;border-top:1px solid #E4E7EF;text-align:left;vertical-align:top;}
.rks-t td.gs-hi{background:#E6F4EA;color:#0B5D1E;font-weight:800;} .rks-t td.gs-mid{background:#FFF4E0;color:#7A4B00;font-weight:800;} .rks-t td.gs-lo{background:#FCE8E6;color:#A50E0E;font-weight:800;}
.rks-row td{min-width:220px;} .rks-a{display:block;font:700 14px Arial,sans-serif;color:#46508A;} .rks-s{display:block;color:#C77A1D;font-size:16px;margin-bottom:6px;}
`;
(document.head || document.documentElement).appendChild(st);
})();
