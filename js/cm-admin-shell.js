/* ============================================================
   🛡 The Admin screen in sections, the Foundational Training way (its js/lsh-program.js groupTabs).

   A row of section pills; under it, the open section's tabs; then a navy banner (.ft-banner) heading the
   section's content. Every admin tab keeps its own render function and its setAdminTab('<id>') button: this
   file only wraps renderAdmin, takes the tab buttons out of the .admin-tabs strip and puts them in their section.
   A tab added later by another script lands in its section too, and a tab no section names goes under
   🛡 Admin Master Control.

   The sections, in Foundational's order, for the admin content Case Management has:
     🏅 Scorecard            audit (👥 Trainee Audit, the lead and the default), scorecards (🏅 Scorecards, the
                             #/scorecard page shown here), tfeedback (💬 Trainee Feedback)
     📊 Rankings             rankings (Foundational's Weekly Reports slot)
     🔗 Drive Links          drivelinks
     🛡 Admin Master Control sop (📋 SOP Reference) and any tab no section names
     🔓 Open Lessons         openlessons (renderAdminOpenLessons, when loaded), activities, fbstyle, studio
   Foundational's Graders, Intake Packets, Assign LORs, Announcements and EOD Inbox have no page in this course,
   so they have no pill (a section shows only when it has a tab).

   Only the outermost renderAdmin wrapper groups (window.cmAdminOut, as Foundational's lshAdminOut): this file
   wraps again once every script has loaded if another wrapper came after it. js/cm-case-flow.js's own grouping
   stands aside while this file is loaded.
   ============================================================ */
(function(){
  if(typeof window === "undefined") return;
  const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));

  const SECTIONS = [
    {id: "scorecard", label: "🏅 Scorecard", tabs: ["audit", "scorecards", "tfeedback"]},
    {id: "rankings", label: "📊 Rankings", tabs: ["rankings"]},
    {id: "drivelinks", label: "🔗 Drive Links", tabs: ["drivelinks"]},
    {id: "admin", label: "🛡 Admin Master Control", tabs: ["sop"]},
    {id: "open", label: "🔓 Open Lessons", tabs: ["openlessons", "activities", "fbstyle", "studio"]}
  ];
  const FALLBACK = "admin";
  // the tabs this file adds (their buttons, and their pages when no other script draws them)
  const OWN = {
    scorecards: {label: "🏅 Scorecards"},
    openlessons: {label: "🔓 Open Lessons"}
  };
  // the base strip's plain labels, given the icons Foundational's tabs have (only when the text is still the plain one)
  const RELABEL = {audit: ["Trainee Audit", "👥 Trainee Audit"], rankings: ["Rankings", "🏆 Rankings"], sop: ["SOP Reference", "📋 SOP Reference"],
    studio: ["Content Studio", "✏️ Content Studio"], tfeedback: ["Trainee Feedback", "💬 Trainee Feedback"]};
  const KICKER = "Legal Support Help · Case Management Training";

  const tabOf = () => state.adminTab || "audit";
  const groupOf = tab => (SECTIONS.find(g => g.tabs.includes(tab)) || SECTIONS.find(g => g.id === FALLBACK)).id;
  const secById = id => SECTIONS.find(g => g.id === id);

  // the .admin-tabs strip in renderAdmin's output: [start, end) with nested <div>s counted
  function stripAt(out){
    const a = out.indexOf('<div class="admin-tabs'); if(a < 0) return null;
    const re = /<div\b|<\/div>/g; re.lastIndex = a; let depth = 0, m;
    while((m = re.exec(out))){ depth += m[0] === "</div>" ? -1 : 1; if(depth === 0) return [a, m.index + 6]; }
    return null;
  }
  function tabsIn(html){
    const t = document.createElement("template"); t.innerHTML = html;
    const seen = new Set(), tabs = [];
    t.content.querySelectorAll(".admin-tab-btn").forEach(b => {
      const id = ((b.getAttribute("onclick") || "").match(/setAdminTab\('([^']+)'\)/) || [])[1];
      if(!id || seen.has(id)) return; seen.add(id);
      const r = RELABEL[id]; if(r && b.textContent.trim() === r[0]) b.textContent = r[1];
      tabs.push({id, label: b.textContent.trim(), el: b});
    });
    return tabs;
  }
  function tabHtml(x, cur){
    const b = x.el; b.classList.toggle("active", x.id === cur); b.setAttribute("type", "button");
    if(x.id === cur) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    return b.outerHTML;
  }
  function groupTabs(out){
    const at = stripAt(out); if(!at) return out;
    const tabs = tabsIn(out.slice(at[0], at[1]));
    Object.keys(OWN).forEach(id => { if(!tabs.some(x => x.id === id)){
      const b = document.createElement("button"); b.className = "admin-tab-btn"; b.setAttribute("onclick", `setAdminTab('${id}')`); b.textContent = OWN[id].label;
      tabs.push({id, label: OWN[id].label, el: b}); } });
    if(!tabs.length) return out;
    const cur = tabOf(), curSec = groupOf(cur);
    const secs = SECTIONS.map(g => ({g, tabs: g.tabs.map(id => tabs.find(x => x.id === id)).filter(Boolean)
      .concat(g.id === FALLBACK ? tabs.filter(x => !SECTIONS.some(s => s.tabs.includes(x.id))) : [])})).filter(x => x.tabs.length);
    const open = secs.find(x => x.g.id === curSec) || secs[0];
    const solo = x => x.tabs.length < 2;
    const bar = `<div class="admin-tabs cmsh-tabs"><div class="cmsh-secs" role="toolbar" aria-label="Admin sections">${secs.map(x => `<button type="button" class="cmsh-sec${x === open ? " active" : ""}" data-sec="${x.g.id}"${x === open ? ' aria-current="true"' : ""} onclick="setAdminTab('${x.tabs[0].id}');cmAdminShell.refocus('${x.g.id}')">${E(x.g.label)}${solo(x) ? "" : `<span>${x.tabs.length}</span>`}</button>`).join("")}</div>
      <div class="cmsh-row"${solo(open) ? " hidden" : ""} aria-label="${E(open.g.label)} tabs">${open.tabs.map(x => tabHtml(x, cur)).join("")}</div></div>`;
    const curTab = open.tabs.find(x => x.id === cur) || open.tabs[0];
    return out.slice(0, at[0]) + bar + banner(out.slice(at[1]), open.g, curTab);
  }

  // the navy banner over the section's content: a page that draws its own (🏅 Scorecards, 📂 Drive Links) keeps it;
  // a page that opens with the old eyebrow and title gives them to the banner
  function banner(body, sec, tab){
    const head = body.slice(0, 1500);
    if(/class="[^"]*\b(ft-banner|dsop-banner)\b/.test(head)) return body;
    let title = tab ? tab.label : sec.label;
    const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(head);
    if(h1){
      const t = document.createElement("template"); t.innerHTML = h1[1]; const txt = t.content.textContent.trim();
      if(txt){ title = (tab && /^\W/.test(tab.label) ? tab.label.split(" ")[0] + " " : "") + txt;
        body = body.slice(0, h1.index) + body.slice(h1.index + h1[0].length);
        const eb = /<p class="eyebrow">[\s\S]*?<\/p>/.exec(body.slice(0, h1.index));
        if(eb) body = body.slice(0, eb.index) + body.slice(eb.index + eb[0].length); }
    }
    return `<div class="ft-banner cmsh-banner"><div><p class="ft-banner-k">${E(KICKER)}</p><h2>${E(title)}</h2><p class="ft-banner-sub">${E(sec.label)} · Admin</p></div></div>` + body;
  }

  // the pages of the tabs this file adds
  let scWait = 0;
  function ownPage(id){
    if(id === "scorecards"){
      if(typeof window.renderScorecardPage !== "function") return placeholder("🏅 Scorecards", "The scorecards are still loading. Refresh the page if this stays.");
      const html = window.renderScorecardPage();
      // js/cm-scorecard.js redraws only on its own #/scorecard page: while it collects the grades, look again here
      if(/Collecting every trainee/.test(html) && scWait < 60){ scWait++; setTimeout(() => { if(state.view === "admin" && tabOf() === "scorecards") render(); }, 700); }
      else scWait = 0;
      return html;
    }
    if(id === "openlessons"){
      if(typeof window.renderAdminOpenLessons === "function") return window.renderAdminOpenLessons();
      return placeholder("🔓 Open Lessons", "Open a lesson for a batch or for one trainee. This page is on its way: in the meantime every lesson is open to every trainee.");
    }
    return "";
  }
  function placeholder(title, text){
    return `<div class="ft-banner cmsh-banner"><div><p class="ft-banner-k">${E(KICKER)}</p><h2>${E(title)}</h2><p class="ft-banner-sub">${E(secById(groupOf(tabOf())).label)} · Admin</p></div></div>
      <div class="card cmsh-empty"><p>${E(text)}</p></div>`;
  }

  function wrap(){
    const inner = window.renderAdmin;
    if(typeof inner !== "function" || inner.__cmShell) return;
    const me = function(){
      const id = state.isAdmin ? tabOf() : "";
      // ✏️ Content Studio starts on Day 1, which this course's days (11–15) don't have: start it on the first day
      if(id === "studio" && typeof DAYS !== "undefined" && DAYS.length && !DAYS.some(d => d.id === (state.studioDay || 1))) state.studioDay = DAYS[0].id;
      let out;
      if(OWN[id]){
        // borrow a light tab for the strip, then draw this tab's page under it
        state.adminTab = "sop"; try{ out = inner.apply(this, arguments); } finally { state.adminTab = id; }
        const at = stripAt(out);
        if(at) out = out.slice(0, at[1]) + ownPage(id);
      } else out = inner.apply(this, arguments);
      return window.cmAdminOut(me, out);
    };
    me.__cmShell = true;
    window.renderAdmin = me;
  }
  // only the outermost wrapper groups, so a later script's tab lands in its section
  window.cmAdminOut = (me, out) => {
    if(window.renderAdmin !== me || typeof out !== "string") return out;
    const html = groupTabs(out);
    return html === out ? out : `<div class="cmsh-screen">${html}</div>`;
  };

  window.cmAdminShell = {
    sections: SECTIONS, groupOf, groupTabs,
    refocus(sec){ setTimeout(() => { const b = document.querySelector(`.cmsh-sec[data-sec="${sec}"]`); if(b) b.focus(); }, 0); }
  };

  // ← / → (and Home / End) move between the section pills, as a toolbar does
  document.addEventListener("keydown", e => {
    const b = e.target && e.target.closest && e.target.closest(".cmsh-sec"); if(!b) return;
    const all = [...document.querySelectorAll(".cmsh-sec")], i = all.indexOf(b);
    const j = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : null;
    if(j == null) return; e.preventDefault(); all[(j + all.length) % all.length].focus();
  });

  wrap();
  // a renderAdmin wrapper loaded after this file: wrap again, outermost
  const again = () => { if(typeof window.renderAdmin === "function" && !window.renderAdmin.__cmShell){ wrap(); if(state && state.view === "admin" && typeof render === "function") render(); } };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", again); else setTimeout(again, 0);
  window.addEventListener("load", again);

  const css = document.createElement("style"); css.id = "cm-admin-shell";
  css.textContent = `
/* Foundational Training's admin sections (js/lsh-program.js, js/ft-admin-tidy.js), in this course's navy and orange */
.cmsh-screen{background:#FFFFFF;border-radius:16px;padding:20px 24px 26px;box-shadow:0 10px 30px rgba(14,18,40,.28);color:#141A2E;}
.admin-tabs.cmsh-tabs{display:block !important;border-bottom:1px solid var(--line,#DDE1EC);margin-bottom:18px;white-space:normal;overflow:visible;}
.cmsh-secs{display:flex;gap:8px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin;margin-bottom:8px;padding:2px 2px 4px;}
.cmsh-sec{font-family:'Poppins','Inter',sans-serif;font-size:15px;font-weight:700;border:1.5px solid #9CA3BD;background:#fff;color:#1E2340;border-radius:999px;padding:8px 15px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;flex:0 0 auto;line-height:1.2;}
.cmsh-sec span{font-size:14px;font-weight:800;background:#DCE0EC;color:#1E2340;border-radius:999px;padding:0 8px;}
.cmsh-sec:hover{border-color:#262B45;}
.cmsh-sec:focus-visible,.cmsh-row .admin-tab-btn:focus-visible{outline:3px solid #DB8437;outline-offset:2px;}
.cmsh-sec.active{background:linear-gradient(135deg,#333A5E 0%,#262B45 52%,#1A1E33 100%);border-color:#262B45;color:#fff;}
.cmsh-sec.active span{background:rgba(255,255,255,.25);color:#fff;}
.cmsh-row{display:flex;gap:8px;flex-wrap:wrap;}
.cmsh-row[hidden]{display:none !important;}
.cmsh-row .admin-tab-btn{font-family:'Poppins','Inter',sans-serif;font-size:16px;font-weight:700;color:#1B2240 !important;}
.cmsh-row .admin-tab-btn.active{font-weight:800;border-bottom-color:#DB8437;}
.cmsh-banner .ft-banner-k{font-size:14px !important;}
.cmsh-banner h2{font-size:26px !important;}
.cmsh-banner .ft-banner-sub{font-size:15px !important;}
.cmsh-screen .dsop-banner .btn-ghost{color:#fff !important;border-color:rgba(255,255,255,.7) !important;background:transparent !important;}
/* the certificate signatories' six inputs fit the white panel (their 1fr columns may shrink below an input's default width) */
.cmsh-screen .cert-settings-grid input,.cmsh-screen .cert-settings-grid select{min-width:0;width:100%;box-sizing:border-box;}
.cmsh-empty{padding:22px 24px;} .cmsh-empty p{margin:0;font-size:16px;color:#2E3450;font-weight:600;}
@media(max-width:760px){
  .cmsh-screen{padding:14px 12px 18px;border-radius:12px;}
  .cmsh-secs{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
  .cmsh-sec{font-size:14px;padding:8px;justify-content:center;white-space:normal;text-align:center;}
  .cmsh-row{gap:6px;padding:4px 0 10px;}
  .cmsh-row .admin-tab-btn{font-size:14px;padding:6px 12px;margin-right:0;border:1px solid #9CA3BD !important;border-radius:999px;background:#fff;}
  .cmsh-row .admin-tab-btn.active{background:#FFF3E6;border-color:#DB8437 !important;color:#1E2340;}
}`;
  document.head.appendChild(css);
})();
