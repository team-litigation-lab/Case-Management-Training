/* LSH course — graded calls from the CMS Call Simulator (the main Call Simulator).
   A graded call taken there (a random caller, unknown until the debrief) counts in this course: the Training Portal keeps
   the trainee's graded calls in callsim:<id> (its /api/call-results), by the Call Simulator line they were taken on, and
   the Worker lets the trainee read it (never write it). The dashboard band shows a "Graded calls" card: the best graded
   call on each line, averaged, with the lines and calls taken (each line's best in its tooltip). Read once a page load,
   and again when the trainee comes back to the tab (at most every two minutes), so a call just taken shows up. */
(function(){
  "use strict";
  if(typeof renderDashboard !== "function") return;
  const trainee = ()=> !!(state && state.traineeId && !state.isAdmin);
  let at = 0, loading = null;
  function load(){
    if(!trainee() || loading || typeof sharedGet !== "function") return loading;
    at = Date.now();
    loading = sharedGet("callsim:" + state.traineeId).then(v=>{
      state.gradedCalls = v && typeof v === "object" ? v : { best: {} }; loading = null;
      if(state.view === "dashboard" && typeof render === "function") render();
    }).catch(()=>{ state.gradedCalls = { best: {} }; loading = null; });
    return loading;
  }
  window.addEventListener("focus", ()=>{ if(state && state.gradedCalls && Date.now() - at > 120000 && state.view === "dashboard") load(); });
  const esc = (s)=> String(s == null ? "" : s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function card(){
    const g = state.gradedCalls || { best: {} }, lines = Object.entries(g.best || {}).filter(([, b])=> b && typeof b.score === "number");
    const calls = Array.isArray(g.calls) ? g.calls.length : lines.reduce((n, [, b])=> n + (b.calls || 0), 0);
    const avg = lines.length ? Math.round(lines.reduce((n, [, b])=> n + b.score, 0) / lines.length) : null;
    const tip = lines.length ? lines.map(([k, b])=> `${(b.line || k.replace(/^line:/, ""))}: best ${b.score}% (${b.calls} call${b.calls === 1 ? "" : "s"})`).join("\n") : "No graded call yet: take one in the CMS Call Simulator.";
    return `<div class="card stat graded-calls-stat" title="${esc(tip)}"><div class="num">${avg === null ? "—" : avg + "%"}</div><div class="lbl">Graded calls · ${lines.length} line${lines.length === 1 ? "" : "s"} · ${calls} call${calls === 1 ? "" : "s"}</div></div>`;
  }
  const __dash = renderDashboard;
  renderDashboard = function(){
    const html = __dash.apply(this, arguments);
    if(!trainee()) return html;
    if(!state.gradedCalls) load();
    // after the band's first card ("Program complete")
    return html.replace(/(<div class="dash-side-inner">\s*<div class="card stat">[\s\S]*?<\/div><\/div>)/, "$1" + card());
  };
  if(__dash.__band) renderDashboard.__band = true;
})();
