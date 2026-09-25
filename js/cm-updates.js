/* ============================================================
   LSH Case Management Training — portal features from the EA/PA update pack "z",
   adapted for the CM course (build/cm-updates: sections 6–8 are EA/PA-only labs
   and are left out; CM overrides at the end).
   Loaded by index.html right after the main script. Everything here
   replaces or extends functions in the main script, so the big
   index.html only needs one extra <script> line.
     1. Lesson slides: one standard size, content centred, and slides that
        don't fit continue on balanced extra pages (Next/Prev step pages first).
     2. Admin ↔ Trainee view switch (top bar) without signing out.
     3. SOP Reference: readable layout + a "Present" mode for live discussion.
     4. Presenter view: share only the slides in Meet, see trainer cues yourself.
     5. All lesson content centred; Orientation deck + Blueprint refreshed.
     6. Email Outreach: capstone Day 4 topic + Email Outreach Simulator (Day 4 lab, Part 4).
     7. Inbox Triage + Inbox Zero merged into one Gmail inbox with labels & sub-labels (Day 2 lab).
     8. Day 3 "Proactive EA Tasks" is now a written, graded exercise.
     9. Practice Lab pages in the platform page style (hero, activity headings, cards, buttons).
    10. SOP: Program flow page + a timed run of show for every day.
   ============================================================ */
window.EAPA_UPDATE_PACK = "z-cm";
(function(){ const s = document.createElement("style"); s.id = "eapa-update-p"; s.textContent = `
.nav .nav-viewswitch{background:rgba(240,192,138,.16) !important;color:#F0C08A !important;border:1px solid rgba(240,192,138,.45) !important;font-weight:700;}
.nav .nav-viewswitch:hover{background:rgba(240,192,138,.28) !important;}
.view-mode-strip{background:#F0C08A;color:#1F2440;font-size:13px;text-align:center;padding:7px 14px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;}
.view-mode-strip button{font:inherit;font-weight:700;background:#1F2440;color:#fff;border:none;border-radius:999px;padding:4px 12px;cursor:pointer;}
/* ================= Standard-size, centred slides =================
   Every slide is the same size. Content sits in a centred column; anything
   that doesn't fit continues on a balanced next page (see paginateLessonSlide). */
.lesson-stage #lessonSlideWrap{height:clamp(440px,66vh,720px);min-height:0;max-height:none;display:flex;flex-direction:column;justify-content:safe center;align-items:center;overflow-y:auto;}
.lesson-stage #lessonSlideWrap > *{width:100%;max-width:1080px;flex-shrink:0;}
.lesson-stage #lessonSlideWrap .topic-separator, .lesson-stage #lessonSlideWrap .lesson-card h4, .lesson-stage #lessonSlideWrap .meet-client-card h3, .lesson-stage #lessonSlideWrap .mc-tag, .lesson-stage #lessonSlideWrap .qc-tag{text-align:center;}
.lesson-stage #lessonSlideWrap .fp-section:first-of-type p, .lesson-stage #lessonSlideWrap .fp-section:first-of-type > div > p{margin-left:auto;margin-right:auto;}
.lesson-stage:fullscreen .stage-body > #lessonSlideWrap.lesson-slide{display:flex;flex-direction:column;justify-content:safe center;align-items:center;height:100%;}
.lesson-stage:fullscreen #lessonSlideWrap > *{max-width:1400px;}
.pg-hide{display:none !important;}
.lesson-stage #lessonSlideWrap.pg-roomy .fp-body > p, .lesson-stage #lessonSlideWrap.pg-roomy .fp-body > ul > li, .lesson-stage #lessonSlideWrap.pg-roomy .fp-section:first-of-type p{font-size:clamp(19px,1.7vw,24px) !important;line-height:1.55;}
.lesson-stage #lessonSlideWrap > .card::before{display:none;}
.lesson-stage #lessonSlideWrap ol.fp-howto-list, .lesson-stage #lessonSlideWrap .fp-section ol{grid-template-columns:repeat(auto-fit,minmax(170px,1fr));}
.lesson-stage #lessonSlideWrap .svg-diagram-card svg{display:block;width:auto;max-width:100%;max-height:calc(clamp(440px,66vh,720px) - 200px);margin:0 auto;}
.lesson-stage:fullscreen #lessonSlideWrap .svg-diagram-card svg{max-height:calc(100vh - 320px);}
.lesson-stage #lessonSlideWrap.pg-anim > *{animation:pgFade .35s ease both;}
@keyframes pgFade{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.lesson-stage #lessonSlideWrap .pg-badge{position:absolute;right:16px;bottom:12px;width:auto;max-width:none;font-family:'IBM Plex Mono',monospace;font-size:11.5px;font-weight:700;letter-spacing:.08em;color:var(--orange-deep);background:#FFF1E2;border-radius:999px;padding:4px 10px;}
.lesson-stage #lessonSlideWrap.pg-later .lesson-card h4::after{content:" · continued";font-family:'IBM Plex Mono',monospace;font-size:.4em;font-weight:700;letter-spacing:.08em;color:var(--ink-soft);vertical-align:middle;}
@media(max-width:760px){.lesson-stage #lessonSlideWrap{height:auto;display:block;overflow:visible;} .lesson-stage #lessonSlideWrap .pg-badge{display:none;}}
/* ================= SOP Reference: readable reference + live Present mode ================= */
.sopx-bar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;}
.sopx-days{display:flex;gap:6px;flex-wrap:wrap;}
.sopx-mode{display:inline-flex;background:#EEF0F6;border-radius:999px;padding:4px;}
.sopx-mode button{font:inherit;font-size:13.5px;font-weight:700;border:none;background:none;color:var(--navy);padding:7px 16px;border-radius:999px;cursor:pointer;}
.sopx-mode button.on{background:var(--navy);color:#fff;}
.sopx-hero{padding:26px 30px;margin-bottom:16px;border-top:6px solid var(--navy);}
.sopx-kicker, .sopx-s-kicker{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--orange-deep);}
.sopx-hero h2{font-family:'Fraunces',Georgia,serif;color:var(--navy);font-size:30px;margin:4px 0 12px;}
.sopx-quote{margin:0 0 14px;padding:12px 16px;border-left:4px solid var(--orange);background:#FFF8EF;border-radius:0 10px 10px 0;font-size:15px;font-style:italic;color:#37394A;}
.sopx-meta{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px;} .sopx-meta.center{justify-content:center;margin-top:18px;}
.sopx-meta span{background:#F3F4F9;border-radius:999px;padding:6px 12px;font-size:13px;color:var(--ink);} .sopx-meta b{color:var(--navy);margin-right:2px;}
.sopx-cols{display:grid;grid-template-columns:1.2fr 1fr;gap:22px;}
.sopx-sub{font-size:13px;font-weight:800;color:var(--navy);margin:0 0 10px;}
.sopx-obj{margin:0;padding-left:22px;} .sopx-obj li{font-size:15px;line-height:1.55;margin-bottom:8px;}
.sopx-chips{display:flex;flex-wrap:wrap;gap:8px;} .sopx-chips span{background:#fff;border:1px solid var(--line);border-left:4px solid var(--orange);border-radius:10px;padding:8px 12px;font-size:14px;line-height:1.35;color:var(--ink);}
.sopx-toc{position:sticky;top:64px;z-index:5;display:flex;gap:6px;overflow-x:auto;background:var(--bg,#F6F4EF);padding:8px 0 10px;margin-bottom:6px;scrollbar-width:thin;}
.sopx-toc b{font-size:12px;color:var(--ink-soft);align-self:center;white-space:nowrap;margin-right:4px;}
.sopx-toc a{white-space:nowrap;font-size:12.5px;font-weight:600;color:var(--navy);background:#fff;border:1px solid var(--line);border-radius:999px;padding:5px 11px;text-decoration:none;}
.sopx-toc a:hover{border-color:var(--orange);color:var(--orange-deep);}
.sopx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start;}
.sopx-sec{padding:18px 22px;margin:0;scroll-margin-top:120px;} .sopx-sec.wide{grid-column:1 / -1;}
.sopx-sec h3{display:flex;align-items:baseline;gap:10px;font-family:'Fraunces',Georgia,serif;font-size:19px;color:var(--navy);margin:0 0 12px;line-height:1.25;}
.sopx-n{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;color:#fff;background:var(--navy);border-radius:6px;padding:2px 7px;flex-shrink:0;}
.sopx-list{margin:0;padding:0;list-style:none;} .sopx-list li{position:relative;padding:7px 0 7px 20px;font-size:15px;line-height:1.55;border-bottom:1px dashed #E8E4DC;}
.sopx-list li:last-child{border-bottom:none;} .sopx-list li::before{content:"";position:absolute;left:3px;top:15px;width:7px;height:7px;border-radius:50%;background:var(--orange);}
.sopx-sec.wide .sopx-list{columns:2;column-gap:28px;} .sopx-sec.wide .sopx-list li{break-inside:avoid;}
.sopx-lbl{color:var(--navy);}
.sopx-p{font-size:15px;line-height:1.7;margin:0;max-width:85ch;}
.sopx-table td{font-size:14px;line-height:1.5;vertical-align:top;} .sopx-table th{font-size:12.5px;} .sopx-table tbody tr:nth-child(even) td{background:#FAFAFC;}
@media(max-width:860px){.sopx-cols, .sopx-grid{grid-template-columns:1fr;} .sopx-sec.wide .sopx-list{columns:1;} .sopx-toc{top:0;}}
/* Present mode */
.sopx-stage{background:linear-gradient(135deg,#1F2440 0%,#2B3158 60%,#353C68 100%);border-radius:20px;padding:16px 20px;}
.sopx-s-top{display:flex;align-items:center;gap:10px;margin-bottom:12px;} .sopx-s-top .btn{margin-left:auto;}
.sopx-jump{font:inherit;font-size:13px;max-width:60%;border-radius:8px;border:none;padding:6px 8px;background:#fff;color:var(--navy);}
.sopx-s-top .btn-ghost{background:#fff;}
.sopx-lbl.blk{display:block;margin-bottom:4px;} .sopx-pt{display:block;font-size:.8em;line-height:1.45;color:var(--ink-soft);font-weight:400;}
.sopx-s-note{font-size:12px;color:#9EA3C2;margin-left:auto;} .sopx-s-note + .btn{margin-left:0;}
@media(max-width:760px){.sopx-s-note{display:none;}}
.sopx-s-count{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#C9CDE3;}
.sopx-slide{background:#FFFDF8;border-radius:16px;height:clamp(420px,64vh,700px);overflow:auto;padding:40px 56px;display:flex;flex-direction:column;justify-content:safe center;align-items:center;text-align:center;position:relative;}
.sopx-slide::before{content:"";position:absolute;inset:0 0 auto 0;height:6px;border-radius:16px 16px 0 0;background:linear-gradient(90deg,var(--navy),var(--orange));}
.sopx-slide > .sopx-fit{max-width:1100px;width:100%;}
.sopx-s-big{font-family:'Fraunces',Georgia,serif;color:var(--navy);font-size:clamp(34px,4vw,58px);line-height:1.1;margin:10px 0 18px;}
.sopx-s-quote{font-size:clamp(17px,1.6vw,22px);font-style:italic;color:#37394A;line-height:1.5;margin:0 auto;max-width:60ch;}
.sopx-s-title{font-family:'Fraunces',Georgia,serif;color:var(--navy);font-size:clamp(26px,2.8vw,42px);line-height:1.15;margin:8px 0 22px;}
.sopx-s-part{font-family:'IBM Plex Mono',monospace;font-size:.4em;color:var(--orange-deep);background:#FFF1E2;border-radius:999px;padding:3px 10px;vertical-align:middle;}
.sopx-s-sub{font-size:clamp(15px,1.3vw,18px);color:var(--ink-soft);margin:-10px 0 18px;}
.sopx-s-list{list-style:none;margin:0;padding:0;display:grid;gap:14px;text-align:left;counter-reset:sx;}
.sopx-s-list.two{grid-template-columns:repeat(2,minmax(0,1fr));}
.sopx-s-list li{counter-increment:sx;position:relative;background:#fff;border:1px solid var(--line);border-left:5px solid var(--navy);border-radius:12px;padding:16px 18px 16px 20px;font-size:clamp(16px,1.45vw,21px);line-height:1.45;color:var(--ink);}
.sopx-s-list li:nth-child(even){border-left-color:var(--orange);}
ol.sopx-s-list li{padding-left:58px;} ol.sopx-s-list li::before{content:counter(sx);position:absolute;left:16px;top:15px;width:28px;height:28px;border-radius:50%;background:var(--navy);color:#fff;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;}
.sopx-s-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;}
.sopx-s-chips span{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 18px;font-size:clamp(16px,1.4vw,20px);color:var(--ink);text-align:left;}
.sopx-s-chips b{background:var(--orange);color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.sopx-s-para{font-size:clamp(18px,1.7vw,24px);line-height:1.6;color:var(--ink);max-width:62ch;margin:0 auto;text-align:left;}
.sopx-s-table{width:100%;border-collapse:separate;border-spacing:0;text-align:left;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;}
.sopx-s-table th{background:var(--navy);color:#fff;font-size:clamp(13px,1.1vw,15px);padding:12px 14px;}
.sopx-s-table td{font-size:clamp(15px,1.3vw,18px);line-height:1.45;padding:12px 14px;border-top:1px solid var(--line);vertical-align:top;}
.sopx-s-bar{height:4px;background:rgba(255,255,255,.15);border-radius:4px;margin:12px 0 0;overflow:hidden;} .sopx-s-bar i{display:block;height:100%;background:#F0C08A;transition:width .3s;}
.sopx-s-nav{display:flex;justify-content:space-between;align-items:center;margin-top:12px;} .sopx-s-nav span{font-size:12px;color:#C9CDE3;} .sopx-s-nav .btn-ghost{background:#fff;}
.sopx-stage:fullscreen{border-radius:0;padding:2.5vh 3vw;display:flex;flex-direction:column;}
.sopx-stage:fullscreen .sopx-slide{flex:1;height:auto;font-size:1.15em;}
.sopx-stage:fullscreen .sopx-s-list li, .sopx-stage:fullscreen .sopx-s-para{font-size:clamp(20px,1.8vw,28px);}
@media(max-width:760px){.sopx-slide{height:auto;min-height:60vh;padding:26px 18px;} .sopx-s-list.two{grid-template-columns:1fr;} .sopx-jump{max-width:48%;}}
/* ---- Presenter view (trainer console) ---- */
.pv{background:linear-gradient(135deg,#1F2440 0%,#2B3158 60%,#353C68 100%);border-radius:20px;padding:16px 18px 18px;color:#fff;}
.pv-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;}
.pv-title{font-size:14px;} .pv-title b{color:#F0C08A;}
.pv-meta{display:flex;gap:10px;align-items:center;margin-left:auto;font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#C9CDE3;}
.pv-meta .pv-timer{background:rgba(255,255,255,.1);border-radius:8px;padding:4px 9px;color:#fff;font-weight:700;}
.pv-aud{border-radius:999px;padding:4px 10px;font-weight:700;} .pv-aud.on{background:rgba(88,190,130,.2);color:#8FE0AE;} .pv-aud.off{background:rgba(240,120,90,.2);color:#FFB39E;}
.pv-actions{display:flex;gap:8px;} .pv-actions .btn-ghost{background:#fff;}
.pv-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(300px,1fr);gap:16px;align-items:start;}
.pv-label{font-family:'IBM Plex Mono',monospace;font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#F0C08A;margin:0 0 8px;}
.pv-mirror{position:relative;width:100%;aspect-ratio:16/9;background:#141833;border-radius:12px;overflow:hidden;box-shadow:0 0 0 2px rgba(240,192,138,.45);}
.pv-frame{position:absolute;top:0;left:0;width:1280px;height:720px;border:0;transform-origin:0 0;pointer-events:none;background:#1F2440;}
.pv-nav{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;} .pv-nav .btn-ghost{background:#fff;}
.pv-nav select{font:inherit;font-size:13px;border-radius:8px;border:none;padding:7px 8px;max-width:52%;color:var(--navy);}
.pv-next{margin-top:10px;font-size:13px;color:#C9CDE3;} .pv-next b{color:#fff;}
.pv-cues{background:#FFFDF8;color:var(--ink);border-radius:14px;padding:16px 18px;max-height:calc(100vh - 150px);overflow:auto;position:sticky;top:80px;}
.pv-cues .pv-label{color:var(--orange-deep);}
.pv-cues h3{font-family:'Fraunces',Georgia,serif;color:var(--navy);font-size:19px;margin:0 0 10px;line-height:1.25;}
.pv-cues p, .pv-cues li{font-size:14.5px;line-height:1.55;}
.pv-cues .tc-tag, .pv-cues .cue-sub{display:block;margin:12px 0 4px;font-size:12px;font-weight:800;color:var(--navy);}
.pv-cues .pv-empty{color:var(--ink-soft);font-size:14px;}
.pv-ans{background:#EAF6EF;border-left:4px solid #3F7D58;border-radius:8px;padding:8px 12px;margin:6px 0 10px;}
.pv-tip{margin:12px 0 0;font-size:12.5px;color:#C9CDE3;} .pv-tip b{color:#fff;}
@media(max-width:1000px){.pv-grid{grid-template-columns:1fr;} .pv-cues{position:static;max-height:none;}}
/* ---- Audience window (shared in Google Meet) ---- */
body.audience-mode{overflow:hidden;background:#1F2440;}
body.audience-mode > *:not(#audienceRoot):not(.aud-hint){display:none !important;}
#audienceRoot{position:fixed;inset:0;}
#audienceRoot .lesson-stage{height:100vh;border-radius:0;display:flex;flex-direction:column;padding:2.5vh 2.5vw;box-sizing:border-box;}
#audienceRoot .stage-body{flex:1;min-height:0;align-items:stretch;grid-template-rows:minmax(0,1fr);}
#audienceRoot .stage-presenter{align-self:end;}
#audienceRoot #lessonSlideWrap{height:100% !important;font-size:1.08em;}
#audienceRoot .slide-nav .btn, #audienceRoot .slide-done-banner{visibility:hidden;}
#audienceRoot .slide-dot{pointer-events:none;}
.aud-wait{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#fff;font-size:18px;text-align:center;padding:20px;}
.aud-wait b{font-family:'Fraunces',Georgia,serif;font-size:30px;color:#F0C08A;}
.aud-hint{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:rgba(0,0,0,.72);color:#fff;border-radius:999px;padding:8px 16px;font-size:13px;z-index:5;transition:opacity .6s;}
.aud-hint.gone{opacity:0;pointer-events:none;}

`; document.head.appendChild(s); })();

/* ---------- 1. standard-size slides ---------- */
function goToSlide(i){
  const maxReached = state.maxSlideReached||0;
  if(i > maxReached){
    toast("Complete the current topic before jumping ahead.");
    return;
  }
  state.slideDir = i>(state.lessonSlide||0) ? "next" : "prev";
  state.lessonSlide = i; state.slidePage = 0;
  refreshLessonSlide();
}
function nextSlide(){
  if((state.slidePages||1) > 1 && (state.slidePage||0) < state.slidePages-1){ showSlidePage((state.slidePage||0)+1); return; }
  const d = DAYS.find(x=>x.id===state.dayId);
  const slides = buildDaySlides(d);
  const nextIdx = (state.lessonSlide||0)+1;
  if(nextIdx <= slides.length-1){
    state.slideDir = "next";
    state.maxSlideReached = Math.max(state.maxSlideReached||0, nextIdx);
    state.slideProgress = state.slideProgress || {};
    state.slideProgress[state.dayId] = state.maxSlideReached;
    storeSet("slide-progress", state.slideProgress);
    state.lessonSlide = nextIdx; state.slidePage = 0;
    refreshLessonSlide();
  }
}
function goToKnowledgeCheckWithInterstitial(){
  if((state.slidePages||1) > 1 && (state.slidePage||0) < state.slidePages-1){ showSlidePage((state.slidePage||0)+1); return; }
  state.dayViewMode = "knowledgeCheck";
  render();
  window.scrollTo({top:0, behavior:"smooth"});
}
function prevSlide(){
  if((state.slidePages||1) > 1 && (state.slidePage||0) > 0){ showSlidePage(state.slidePage-1); return; }
  if((state.lessonSlide||0) > 0){
    state.slideDir = "prev";
    state.lessonSlide = (state.lessonSlide||0)-1;
    state.slidePage = -1;   // land on the last page of the previous slide
    refreshLessonSlide();
  }
}
function narratorAfterRender(pageOnly){
  if(state.view!=="day"){ if(Narrator.playing) Narrator.stop(true); __lastNarrKey = ""; return; }
  if(!pageOnly){ decorateCallouts(); paginateLessonSlide(); }
  const key = state.dayId+":"+(state.lessonSlide||0)+":"+(state.slidePage||0)+":"+state.dayViewMode;
  if(key!==__lastNarrKey){ __lastNarrKey = key; Narrator.afterSlideChange(); } else Narrator.paint();
}
function renderTopbar(){
  let views = [["dashboard","Dashboard"],["tasks","🎲 Tasks"],["clientprofile","Case File"],["casedocs","📁 Documents"],["practice","Skill Builders"],["calls","🛠 Simulators"],["tools","🧰 Tools"],["crisisroleplay","🔥 Roleplay"],["notes","Notes"],["handouts","Handouts"]];
  if(state.isAdmin){
    // Admin is a trainer monitoring dashboard, not a trainee workspace — hide
    // the trainee-facing-only views that have no role here.
    views = views.filter(([id]) => !["crisisroleplay","notes","handouts","tasks"].includes(id));
    views.push(["orientation","🧭 Orientation"]);
    views.push(["facilitatorguide","Facilitator Guide"]);
  }
  return `
  ${state.adminPreview ? `<div class="view-mode-strip">👁 <b>Trainee view</b> — you're seeing the portal as a trainee sees it (every day unlocked for preview). <button type="button" onclick="setAdminViewMode('admin')">Switch back to Admin view</button></div>` : ""}
  <div class="topbar ${state.mobileNavOpen?'nav-open':''}">
    <div class="topbar-inner">
      <div class="brand" onclick="goto('dashboard')">
        ${brandMark()}
        <div class="brand-text"><b>LSH Case Management Training</b><span>5-Day Interactive Training</span></div>
      </div>
      <button type="button" class="mobile-menu-btn" aria-label="Menu" aria-expanded="${state.mobileNavOpen?'true':'false'}" onclick="toggleMobileNav()">${state.mobileNavOpen?'✕':'☰'}<span>Menu</span></button>
      <div class="topbar-right">
        <div class="topbar-search">
          <span class="sicon">🔍</span>
          <input type="text" id="topSearchInput" name="topSearchInput" autocomplete="off" placeholder="Search days, topics, tools…" value="${esc(state.searchQuery||'')}" oninput="setTopSearch(this.value)" onkeydown="if(event.key==='Escape') clearTopSearch();">
          ${state.searchQuery ? `<div class="search-results" id="searchResultsWrap">${renderSearchResults(state.searchQuery)}</div>` : ""}
        </div>
        <div class="nav">
          ${views.map(([id,label])=>`<button class="${state.view===id?'active':''}" onclick="goto('${id}')">${label}${id==="tasks" && openTasksCount() ? `<span class="nav-badge">${openTasksCount()}</span>` : ""}</button>`).join("")}
          ${(state.traineeId && !state.isAdmin) ? `<button type="button" class="nav-focus" onclick="openFocusPanel()" title="My Focus — trainer feedback and what to work on next">🎯 Focus${focusNewCount()?`<span class="nav-badge">${focusNewCount()}</span>`:""}</button>` : ""}
          ${state.adminPreview
            ? `<button type="button" class="nav-viewswitch" onclick="setAdminViewMode('admin')" title="Return to the admin (trainer) view">🛡 Back to Admin view</button>`
            : `<button class="${state.view==='admin'?'active':''}" onclick="openAdmin()">🛡 Admin</button>`}
          ${state.isAdmin ? `<button type="button" class="nav-viewswitch" onclick="setAdminViewMode('trainee')" title="See the portal exactly as a trainee does — no trainer tools or admin pages">👁 Trainee view</button>` : ""}
          <button type="button" class="nav-fs" onclick="togglePageFullscreen()" title="Full screen (Esc to exit)">⛶</button>
        </div>
        <div class="trainee-chip" onclick="promptName()">
          <span class="dot"></span> ${state.traineeName ? esc(state.traineeName) : "Set your name"}
        </div>
      </div>
    </div>
  </div>`;
}
function authHeaders(){
  const t = ((state.isAdmin || state.adminPreview) && state.adminToken) || state.authToken;
  return Object.assign({"Content-Type":"application/json"}, t ? {"Authorization":"Bearer "+t} : {});
}
async function authFetch(url, payload){
  const doFetch = ()=>fetch(url, {method:"POST", headers:authHeaders(), body: JSON.stringify(payload)});
  let res = await doFetch();
  if(res.status===401 && !state.isAdmin && await reauthTrainee()) res = await doFetch();
  if(res.status===401 && (state.isAdmin || state.adminPreview)){ setAdminToken(""); state.isAdmin = false; state.adminPreview = false; try{ sessionStorage.removeItem("lsh_admin_preview"); }catch(e){} toast("Your admin session expired — click 🛡 Admin and sign in again."); }
  return res;
}
Narrator.slideText = function(){
    const card = document.querySelector("#lessonSlideWrap"); if(!card) return "";
    const clone = card.cloneNode(true);
    clone.querySelectorAll(".pg-hide, .pg-badge, svg, .svg-diagram-card, .vis-flow, .vis-chips, .vis-label, .topic-separator, .fp-num, .lnum, .vis-badge, .vis-card-i, .qc-actions, .quiz-rationale:not(.show), button, .lx-panel:not([open])").forEach(n=>n.remove());
    return clone.innerText.replace(/\s*\n+\s*/g, ". ").replace(/(\.\s*){2,}/g, ". ").replace(/[→➜]/g, ", then ").replace(/\s+/g," ").trim();
  };
/* ---------- Standard-size slides: content that doesn't fit continues on the next page ----------
   The slide box has a fixed size. After each render we measure the content blocks
   and, if they overflow, split them into the fewest pages possible and then
   rebalance so every page carries a similar amount (no crammed page + near-empty
   page). Next / Previous (and the arrow keys) step through pages before slides.
   Headings (kicker, title, section labels) repeat on every page of their block. */
const SLIDE_PG_BLOCKS = ".card, .lesson-card, .meet-client-card, .qcheck-card, .fp-section, .fp-body, .trainer-checkpoint";
const SLIDE_PG_HEADS = "h2, h3, h4, .topic-separator, .fp-label, .mc-tag, .tc-tag, .qc-tag, .discussion-tag, .vis-label";
let __slidePg = null;
function collectSlideUnits(root, bigH){
  const units = [];
  const walk = (el)=>{
    for(const c of el.children){
      if(c.matches(SLIDE_PG_HEADS) || c.classList.contains("pg-badge")) continue;
      if(c.matches(SLIDE_PG_BLOCKS)){ walk(c); continue; }
      // lists and card grids may break between items — but only when they're tall;
      // short ones (e.g. a row of 3 step cards) always stay together
      if(c.children.length > 1 && c.getBoundingClientRect().height > bigH){
        const cs = getComputedStyle(c);
        if(c.matches("ul, ol") || cs.display.includes("grid") || (cs.display.includes("flex") && (cs.flexWrap==="wrap" || cs.flexDirection==="column"))){ units.push(...c.children); continue; }
      }
      units.push(c);
    }
  };
  walk(root);
  return units.filter(u=>u.getClientRects().length);
}
function paginateLessonSlide(){
  const wrap = document.getElementById("lessonSlideWrap");
  __slidePg = null; state.slidePages = 1;
  if(!wrap) return;
  const key = state.dayId+":"+(state.lessonSlide||0);
  if(state.slidePageKey !== key){ state.slidePageKey = key; if(state.slidePage !== -1) state.slidePage = 0; }
  wrap.querySelectorAll(".pg-hide").forEach(n=>n.classList.remove("pg-hide"));
  wrap.querySelectorAll(".pg-badge").forEach(n=>n.remove());
  wrap.querySelectorAll("ol[data-pg-start]").forEach(ol=>{ ol.removeAttribute("start"); ol.style.counterReset = ""; ol.removeAttribute("data-pg-start"); });
  wrap.classList.remove("pg-later", "pg-roomy");
  if(window.innerWidth <= 760){ state.slidePage = 0; updateSlidePageUi(); return; }   // phones: the page scrolls instead
  const cs = getComputedStyle(wrap);
  const padT = parseFloat(cs.paddingTop)||0, padB = parseFloat(cs.paddingBottom)||0;
  const avail = wrap.clientHeight - padT - padB;
  const units = collectSlideUnits(wrap, avail*0.4);
  const base = wrap.getBoundingClientRect().top - wrap.scrollTop;
  const box = units.map(u=>{ const r = u.getBoundingClientRect(); return {top:r.top-base, bottom:r.bottom-base}; });
  if(units.length < 2 || wrap.scrollHeight <= wrap.clientHeight + 2){ state.slidePage = 0; updateSlidePageUi(); return; }
  const headH = Math.max(0, box[0].top - padT);   // kicker + title, repeated on every page
  const room = Math.max(160, avail - headH - 56);   // 56px: section labels repeated on continued pages
  // never break between cards sitting on the same row of a grid
  const canBreak = box.map((b,i)=>i>0 && Math.abs(b.top - box[i-1].top) > 2);
  const pack = (limit)=>{
    const out = []; let s = 0, maxB = box[0].bottom, brk = -1;
    for(let i=1;i<box.length;i++){
      if(canBreak[i]) brk = i;
      maxB = Math.max(maxB, box[i].bottom);
      if(maxB - box[s].top > limit && brk > s){
        out.push([s,brk-1]); s = brk; brk = -1;
        maxB = 0; for(let k=s;k<=i;k++) maxB = Math.max(maxB, box[k].bottom);
      }
    }
    out.push([s,box.length-1]); return out;
  };
  let pages = pack(room);
  if(pages.length > 1){   // balance: the smallest page height that still needs no extra pages
    let lo = 0, hi = room;
    for(let k=0;k<16;k++){ const mid = (lo+hi)/2; if(pack(mid).length <= pages.length) hi = mid; else lo = mid; }
    pages = pack(hi);
  }
  if(pages.length < 2){ state.slidePage = 0; updateSlidePageUi(); return; }
  const heights = pages.map(([a,b])=>Math.max(...box.slice(a,b+1).map(x=>x.bottom)) - box[a].top);
  __slidePg = {wrap, units, pages, heights, room};
  state.slidePages = pages.length;
  if(state.slidePage === -1 || (state.slidePage||0) >= pages.length) state.slidePage = pages.length-1;
  applySlidePage();
}
function applySlidePage(){
  const pg = __slidePg; if(!pg) return;
  const p = state.slidePage||0, [a,b] = pg.pages[p];
  pg.units.forEach((u,i)=>u.classList.toggle("pg-hide", i<a || i>b));
  // hide blocks (and their headings) with nothing left to show on this page
  pg.wrap.querySelectorAll(SLIDE_PG_BLOCKS).forEach(bl=>{
    const mine = pg.units.filter(u=>bl.contains(u));
    if(mine.length) bl.classList.toggle("pg-hide", mine.every(u=>u.classList.contains("pg-hide")));
  });
  // numbered lists split across pages keep counting (4, 5, 6… not 1, 2, 3)
  pg.wrap.querySelectorAll("ol").forEach(ol=>{
    const items = [...ol.children]; const first = items.findIndex(li=>!li.classList.contains("pg-hide"));
    if(first > 0){ ol.setAttribute("start", String(first+1)); ol.style.counterReset = "st "+first; ol.setAttribute("data-pg-start","1"); }
    else if(ol.hasAttribute("data-pg-start")){ ol.removeAttribute("start"); ol.style.counterReset = ""; ol.removeAttribute("data-pg-start"); }
  });
  pg.wrap.classList.toggle("pg-later", p > 0);
  pg.wrap.classList.toggle("pg-roomy", pg.heights[p] < pg.room*0.4);   // a light page gets larger type so it doesn't look empty
  pg.wrap.querySelectorAll(".pg-badge").forEach(n=>n.remove());
  pg.wrap.insertAdjacentHTML("beforeend", `<div class="pg-badge">PAGE ${p+1} / ${pg.pages.length}${p < pg.pages.length-1 ? " · CONTINUES →" : ""}</div>`);
  pg.wrap.scrollTop = 0;
  updateSlidePageUi();
}
function updateSlidePageUi(){
  const stage = document.getElementById("lessonStage") || document;
  const counter = stage.querySelector(".slide-nav .slide-counter");
  if(counter){
    const base = counter.dataset.base || counter.textContent; counter.dataset.base = base;
    counter.textContent = (state.slidePages||1) > 1 ? `${base} · Page ${(state.slidePage||0)+1} of ${state.slidePages}` : base;
  }
  const next = stage.querySelector(".slide-nav .btn-primary");
  if(next){
    const label = next.dataset.base || next.innerHTML; next.dataset.base = label;
    next.innerHTML = (state.slidePages||1) > 1 && (state.slidePage||0) < state.slidePages-1 ? "Next page &rarr;" : label;
  }
  const prev = stage.querySelector(".slide-nav .btn-ghost");
  if(prev && (state.lessonSlide||0) === 0) prev.disabled = !((state.slidePage||0) > 0);
}
function showSlidePage(p){
  state.slidePage = Math.max(0, Math.min(p, (state.slidePages||1)-1));
  applySlidePage();
  const w = document.getElementById("lessonSlideWrap");
  if(w){ w.classList.remove("pg-anim"); void w.offsetWidth; w.classList.add("pg-anim"); }
  narratorAfterRender(true);
}
window.showSlidePage = showSlidePage;
let __pgResizeT = null;
function repaginateSoon(){ clearTimeout(__pgResizeT); __pgResizeT = setTimeout(()=>{ if(state.view==="day" && document.getElementById("lessonSlideWrap")) paginateLessonSlide(); }, 180); }
window.addEventListener("resize", repaginateSoon);
document.addEventListener("fullscreenchange", repaginateSoon);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(repaginateSoon);

/* ---------- 2. admin ↔ trainee view ---------- */
/* Admin ↔ Trainee view: an admin can flip the whole portal into the trainee
   experience (trainee nav, no trainer tools/admin pages) and back, without
   signing out. Their admin session stays active underneath. */
function setAdminViewMode(mode){
  if(mode==="trainee"){
    if(!state.isAdmin) return;
    state.isAdmin = false; state.adminPreview = true;
    try{ sessionStorage.setItem("lsh_admin_preview","1"); }catch(e){}
    const back = ["admin","orientation","facilitatorguide"].includes(state.view) ? "dashboard" : state.view;
    if(state.view==="day") render(); else goto(back);
    toast("👁 Trainee view — this is what trainees see. Use “Back to Admin view” to return.");
  }else{
    if(!state.adminPreview) return;
    state.adminPreview = false; state.isAdmin = true;
    try{ sessionStorage.removeItem("lsh_admin_preview"); }catch(e){}
    if(state.view==="day"){ state.maxSlideReached = 9999; render(); } else goto(state.view==="dashboard" ? "admin" : state.view);
    toast("🛡 Back in Admin view.");
  }
}
window.setAdminViewMode = setAdminViewMode;
function toolUnlocked(t){ const n = toolDayOf(t); return state.isAdmin || state.adminPreview || !n || dayUnlocked(n); }
const __eapaDayUnlocked = window.dayUnlocked;
window.dayUnlocked = function(id){ return state.adminPreview ? true : __eapaDayUnlocked(id); };
const __eapaGoto = window.goto;
window.goto = function(view, id){ __eapaGoto(view, id); if(view==="day" && state.adminPreview && state.maxSlideReached !== 9999){ state.maxSlideReached = 9999; render(); } };
const __eapaOpenAdmin = window.openAdmin;
window.openAdmin = function(){ if(state.adminPreview){ setAdminViewMode("admin"); return; } return __eapaOpenAdmin(); };
const __eapaAdminLogout = window.adminLogout;
window.adminLogout = function(){ state.adminPreview = false; try{ sessionStorage.removeItem("lsh_admin_preview"); }catch(e){} return __eapaAdminLogout(); };
const __eapaLogout = window.logout;
window.logout = function(){ state.adminPreview = false; return __eapaLogout.apply(this, arguments); };
const __eapaForceLogout = window.forceRevokedLogout;
window.forceRevokedLogout = function(){ state.adminPreview = false; return __eapaForceLogout.apply(this, arguments); };

/* ---------- 3. SOP Reference + Present mode ---------- */
const __eapaSopLive = window.sopLiveSections;
window.sopLiveSections = function(d){
  const tags = {"Session plan":"plan", "Topics covered":"topics", "Skill Builders":"lab", "After the session":"after"};
  return __eapaSopLive(d).map(s=>{ const k = Object.keys(tags).find(t=>String(s.h).startsWith(t)); return k ? Object.assign({}, s, {live:tags[k]}) : s; });
};
/* ---------- SOP Reference ----------
   Two ways to use it:
   • Reference — a scannable page: day summary up top, a jump list, then each
     section as a numbered card with larger type ("Label: detail" lines get a bold label).
   • Present — for live discussion: one short slide at a time, big type, long
     sections split into balanced parts, ← → keys and full screen. */
function renderAdminSOP(){
  const day = state.sopDay==null ? 0 : state.sopDay;
  const d = day ? sopForDay(day) : null;
  const availableDays = DAYS.map(x=>x.id);
  const mode = state.sopMode || "read";
  return `
    <p class="eyebrow">Admin — Reference</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 4px;">SOP Reference</h1>
    <p style="color:var(--ink-soft);font-size:13px;max-width:70ch;margin:0 0 20px;">How to facilitate this training. Start with <b>🧭 Program flow</b>, then each day's <b>Run of show</b> — a timed, step-by-step plan built from that day's content — followed by the detailed script. Use <b>Present</b> to show a day's content to the room.</p>
    <div class="sopx-bar">
      <div class="sopx-days">
        <button class="btn btn-sm ${day===0?'btn-navy':'btn-ghost'}" onclick="setSopDay(0)">🧭 Program flow</button>
        ${Array.from({length:10},(_,i)=>i+1).map(n=>{
          const has = availableDays.includes(n);
          return `<button class="btn btn-sm ${n===day?'btn-navy':'btn-ghost'}" ${has?'':'disabled title="Not yet added"'} onclick="setSopDay(${n})">Day ${n}${has?'':' (soon)'}</button>`;
        }).join("")}
      </div>
      <div class="sopx-mode" role="tablist" style="${day===0?"display:none":""}">
        <button class="${mode==="read"?"on":""}" onclick="setSopMode('read')">📖 Reference</button>
        <button class="${mode==="present"?"on":""}" onclick="setSopMode('present')">🎤 Present</button>
      </div>
    </div>
    ${day===0 ? sopProgramFlow() : !d ? `<div class="card" style="padding:30px;text-align:center;color:var(--ink-soft);">Day ${day}'s SOP content hasn't been added yet.</div>`
      : mode==="present" ? renderSopPresent(d) : renderSopDayContent(d)}
  `;
}
/* "Mindset: Strategic Partner" → bold label + detail */
function sopItemHtml(t){
  if(t && typeof t==="object") return `<b class="sopx-lbl blk">${esc(t.label)}</b>${t.text ? `<span class="sopx-pt">${esc(t.text)}</span>` : ""}`;
  const s = String(t||""); const m = s.match(/^([^:.!?]{2,42}):\s+(.+)$/);
  return m ? `<b class="sopx-lbl">${esc(m[1])}:</b> ${esc(m[2])}` : esc(s);
}
function renderSopDayContent(d){
  const info = d.discussionInfo || {};
  const meta = [["⏱","Duration",info.duration],["🖥","PPT",info.ppt],["🎨","Canva",info.canvaLabel],["🎬","Video",info.video]].filter(x=>x[2]);
  return `
    <div class="card sopx-hero">
      <div class="sopx-kicker">Day ${d.id} · Trainer SOP</div>
      <h2>${esc(d.title)}</h2>
      ${d.introduction ? `<blockquote class="sopx-quote">“${esc(d.introduction)}”</blockquote>` : ""}
      ${meta.length ? `<div class="sopx-meta">${meta.map(([i,k,v])=>`<span>${i} <b>${k}</b> ${esc(v)}</span>`).join("")}</div>` : ""}
      <div class="sopx-cols">
        <div><div class="sopx-sub">🎯 Objectives — participants will be able to</div>
          <ol class="sopx-obj">${(d.objectives||[]).map(o=>`<li>${esc(o)}</li>`).join("")}</ol></div>
        <div><div class="sopx-sub">🗂 Today we will discuss</div>
          <div class="sopx-chips">${(d.topics||[]).map(t=>`<span>${esc(t)}</span>`).join("")}</div></div>
      </div>
    </div>
    ${sopRunOfShow(d)}
    ${d.handWritten ? "" : `<div class="empty-note" style="margin-bottom:12px;">This day's SOP is generated from the live portal content, so it always matches what trainees see. Add a hand-written script for it any time and it will appear above the auto-built plan.</div>`}
    <nav class="sopx-toc"><b>Jump to</b>${d.sections.map((s,i)=>`<a href="#sopsec-${i}" onclick="event.preventDefault();document.getElementById('sopsec-${i}').scrollIntoView({behavior:'smooth',block:'start'})">${i+1}. ${esc(s.h)}</a>`).join("")}</nav>
    <div class="sopx-grid">${d.sections.map(renderSopSection).join("")}</div>
  `;
}
function renderSopSection(s, i){
  let body = "", wide = false;
  if(s.type==="bullets"){
    body = `<ul class="sopx-list">${s.items.map(x=>`<li>${sopItemHtml(x)}</li>`).join("")}</ul>`;
    wide = s.items.length > 7 || s.items.join(" ").length > 700;
  }else if(s.type==="paragraph"){
    body = `<p class="sopx-p">${esc(s.text)}</p>`;
    wide = String(s.text||"").length > 500;
  }else if(s.type==="table"){
    body = `<div style="overflow-x:auto;"><table class="log-table sopx-table"><thead><tr>${s.headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${s.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    wide = true;
  }
  return `
    <section class="card sopx-sec ${wide?"wide":""}" id="sopsec-${i}">
      <h3><span class="sopx-n">${String(i+1).padStart(2,"0")}</span>${esc(s.h)}</h3>
      ${body}
    </section>`;
}
/* ---- Present mode ---- */
function sopChunk(items, weight, budget, maxN){
  // Split into the fewest parts that respect the budget, then even them out.
  const total = items.reduce((a,x)=>a+weight(x),0);
  const parts = Math.max(Math.ceil(total/budget), Math.ceil(items.length/maxN), 1);
  const target = total/parts, out = [[]]; let acc = 0;
  items.forEach(x=>{
    const w = weight(x);
    if(out[out.length-1].length && (acc + w/2 > target*out.length) && out.length < parts){ out.push([]); }
    out[out.length-1].push(x); acc += w;
  });
  return out;
}
function sopPresentSlides(d){
  const info = d.discussionInfo || {};
  const slides = [{kind:"title", d, info}];
  if((d.objectives||[]).length) slides.push({kind:"list", h:"Objectives", sub:"By the end of this session, participants will be able to:", items:d.objectives, ordered:true});
  if((d.topics||[]).length) slides.push({kind:"chips", h:"Today we will discuss", items:d.topics});
  // Trainer-only planning sections (session plan, lab admin notes, after-session
  // checklist) stay in Reference; the auto-built topic table becomes simple
  // "topic — key point" slides (trainer cues are never shown on a shared screen).
  const shown = d.sections.filter(s=>!["plan","lab","after"].includes(s.live));
  shown.forEach((s0,si)=>{
    const s = s0.live==="topics" ? {h:"Topics we'll cover", type:"bullets", items:s0.rows.map(r=>({label:r[1], text:r[2]}))} : s0;
    let parts = [];
    if(s.type==="bullets") parts = sopChunk(s.items, x=>typeof x==="object" ? 30+(x.label+" "+x.text).length*0.35 : 60+String(x).length, 520, 6).map(items=>({kind:"list", items}));
    else if(s.type==="paragraph"){
      const sentences = String(s.text||"").match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [s.text];
      parts = sopChunk(sentences, x=>x.length, 420, 99).map(ss=>({kind:"para", text:ss.join("").trim()}));
    }else if(s.type==="table") parts = sopChunk(s.rows, r=>80+r.join(" ").length, 700, 5).map(rows=>({kind:"table", headers:s.headers, rows}));
    parts.forEach((p,pi)=>slides.push(Object.assign(p, {h:s.h, num:si+1, of:shown.length, part:pi+1, parts:parts.length})));
  });
  return slides;
}
function renderSopSlide(sl, d){
  const head = (k)=>`<div class="sopx-s-kicker">${k}</div><h2 class="sopx-s-title">${esc(sl.h)}${sl.parts>1?` <span class="sopx-s-part">${sl.part} / ${sl.parts}</span>`:""}</h2>`;
  const kick = sl.num && sl.of > 1 ? `Day ${d.id} · Section ${sl.num} of ${sl.of}` : `Day ${d.id}`;
  if(sl.kind==="title"){
    const i = sl.info;
    return `<div class="sopx-s-kicker">Day ${d.id} · Upskill Training</div>
      <h1 class="sopx-s-big">${esc(d.title)}</h1>
      ${d.introduction ? `<p class="sopx-s-quote">“${esc(d.introduction)}”</p>` : ""}
      <div class="sopx-meta center">${[["⏱",i.duration],["🖥",i.ppt],["🎬",i.video]].filter(x=>x[1]).map(([e,v])=>`<span>${e} ${esc(v)}</span>`).join("")}</div>`;
  }
  if(sl.kind==="chips") return head(kick) + `<div class="sopx-s-chips">${sl.items.map((t,k)=>`<span><b>${k+1}</b>${esc(t)}</span>`).join("")}</div>`;
  if(sl.kind==="list"){
    const tag = sl.ordered ? "ol" : "ul";
    return head(kick) + (sl.sub?`<p class="sopx-s-sub">${esc(sl.sub)}</p>`:"") + `<${tag} class="sopx-s-list ${sl.items.length>3?"two":""}">${sl.items.map(x=>`<li>${sopItemHtml(x)}</li>`).join("")}</${tag}>`;
  }
  if(sl.kind==="para") return head(kick) + `<p class="sopx-s-para">${esc(sl.text)}</p>`;
  if(sl.kind==="table") return head(kick) + `<table class="sopx-s-table"><thead><tr>${sl.headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${sl.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  return "";
}
function renderSopPresent(d){
  const slides = sopPresentSlides(d);
  const idx = Math.max(0, Math.min(state.sopSlide||0, slides.length-1)); state.sopSlide = idx;
  const sl = slides[idx];
  const outline = [];
  slides.forEach((s,k)=>{ if(s.part===1 || !s.part) outline.push({k, label: s.kind==="title" ? "Welcome" : s.h}); });
  return `
    <div class="sopx-stage" id="sopStage">
      <div class="sopx-s-top">
        <select class="sopx-jump" onchange="sopGo(+this.value, true)" title="Jump to a section">${outline.map(o=>`<option value="${o.k}" ${slides[idx].h===slides[o.k].h && (slides[idx].kind==="title")===(slides[o.k].kind==="title")?"selected":""}>${esc(o.label)}</option>`).join("")}</select>
        <span class="sopx-s-count">${idx+1} / ${slides.length}</span>
        <span class="sopx-s-note">Trainer-only planning notes stay in Reference</span>
        <button class="btn btn-sm btn-ghost" onclick="sopFullscreen()">⛶ Full screen</button>
      </div>
      <div class="sopx-slide" id="sopSlide"><div class="sopx-fit">${renderSopSlide(sl, d)}</div></div>
      <div class="sopx-s-bar"><i style="width:${Math.round((idx+1)/slides.length*100)}%"></i></div>
      <div class="sopx-s-nav">
        <button class="btn btn-ghost" onclick="sopGo(-1)" ${idx===0?"disabled":""}>← Previous</button>
        <span>Use ← → keys</span>
        <button class="btn btn-primary" onclick="sopGo(1)" ${idx===slides.length-1?"disabled":""}>Next →</button>
      </div>
    </div>`;
}
function sopGo(v, absolute){
  const d = sopForDay(state.sopDay||1); if(!d) return;
  const n = sopPresentSlides(d).length;
  state.sopSlide = Math.max(0, Math.min(absolute ? v : (state.sopSlide||0)+v, n-1));
  const stage = document.getElementById("sopStage");
  if(stage){ const tmp = document.createElement("div"); tmp.innerHTML = renderSopPresent(d); stage.innerHTML = tmp.querySelector("#sopStage").innerHTML; fitSopSlide(); }
  else render();
}
/* shrink a slide's content just enough to fit the fixed slide box (never below 70%) */
function fitSopSlide(){
  const box = document.getElementById("sopSlide"); const fit = box && box.querySelector(".sopx-fit"); if(!fit) return;
  let z = 1; fit.style.zoom = "1";
  while(box.scrollHeight > box.clientHeight + 1 && z > 0.7){ z -= 0.05; fit.style.zoom = String(z); }
}
window.addEventListener("resize", ()=>{ if(document.getElementById("sopSlide")) fitSopSlide(); });
document.addEventListener("fullscreenchange", ()=>setTimeout(()=>{ if(document.getElementById("sopSlide")) fitSopSlide(); }, 120));
function sopFullscreen(){
  const el = document.getElementById("sopStage");
  if(!document.fullscreenElement && el && el.requestFullscreen) el.requestFullscreen().catch(()=>toast("Your browser blocked full screen — press F11 instead."));
  else if(document.exitFullscreen) document.exitFullscreen();
}
function setSopMode(m){ state.sopMode = m; state.sopSlide = 0; render(); }
document.addEventListener("keydown", (e)=>{
  if(state.view!=="admin" || (state.adminTab||"audit")!=="sop" || state.sopMode!=="present" || (typeof isTyping==="function" && isTyping()) || document.querySelector(".overlay")) return;
  if(e.key==="ArrowRight" || e.key==="PageDown"){ e.preventDefault(); sopGo(1); }
  else if(e.key==="ArrowLeft" || e.key==="PageUp"){ e.preventDefault(); sopGo(-1); }
});
Object.assign(window, {sopGo, sopFullscreen, setSopMode});
function setSopDay(d){ state.sopDay=d; state.sopSlide=0; render(); }
const __eapaAfterRender = window.afterRender;
window.afterRender = function(){ if(document.getElementById("sopSlide")) fitSopSlide(); return __eapaAfterRender.apply(this, arguments); };


/* ---------- 4. Presenter view (like Canva's) ----------
   The trainer clicks "🖥 Presenter view" on a lesson. A second window opens
   showing ONLY the slides — that's the window you share in Google Meet. This
   tab turns into the presenter console: a live mirror of what the room sees
   (a small copy of the slides window, rendered at its exact size), the trainer
   cues / discussion script for the current slide, what's next, a timer and the
   controls. The windows talk over a BroadcastChannel.
     ?audience=1       the slides window you share
     ?audience=mirror  the small live copy inside the presenter console */
const PV_CHANNEL = "lsh-present-v1";
const PV_MODE = new URLSearchParams(location.search).get("audience") || "";
const PV_IS_AUDIENCE = PV_MODE === "1" || PV_MODE === "mirror";
const PV = {ch:null, win:null, size:null, startedAt:0, tick:null};
function pvChannel(){ if(!PV.ch && "BroadcastChannel" in window) PV.ch = new BroadcastChannel(PV_CHANNEL); return PV.ch; }

/* ----- presenter side ----- */
function pvOpenSlidesWindow(){
  PV.win = window.open(`/?audience=1&day=${state.dayId}`, "lshAudience", "popup=yes,width=1280,height=760");
  return !!PV.win;
}
function presenterStart(){
  if(!state.isAdmin){ toast("Presenter view is for trainers — sign in to Admin first."); return; }
  if(!pvChannel()){ toast("This browser can't run Presenter view — use Chrome or Edge."); return; }
  const d = DAYS.find(x=>x.id===state.dayId); if(!d) return;
  if(document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
  if(!pvOpenSlidesWindow()){ toast("Your browser blocked the slides window — allow pop-ups for this site, then click Presenter view again."); return; }
  state.presenting = true; state.dayViewMode = "slides"; state.maxSlideReached = 9999;
  state.presentPage = 0; state.presentPages = 1; PV.startedAt = Date.now();
  if(typeof Narrator!=="undefined" && Narrator.playing) Narrator.stop(true);
  clearInterval(PV.tick); PV.tick = setInterval(presenterTick, 1000);
  render(); presenterSend();
}
function presenterSend(){ const ch = pvChannel(); if(ch) ch.postMessage({type:"show", dayId:state.dayId, slide:state.lessonSlide||0, page:state.presentPage||0}); }
function presenterStep(dir){
  const d = DAYS.find(x=>x.id===state.dayId); if(!d) return;
  const total = buildDaySlides(d).length, slide = state.lessonSlide||0, page = state.presentPage||0, pages = state.presentPages||1;
  if(dir > 0){
    if(page < pages-1){ state.presentPage = page+1; }
    else if(slide < total-1){ state.lessonSlide = slide+1; state.presentPage = 0; state.presentPages = 1; }
    else return;
  }else{
    if(page > 0){ state.presentPage = page-1; }
    else if(slide > 0){ state.lessonSlide = slide-1; state.presentPage = -1; state.presentPages = 1; }
    else return;
  }
  presenterSend(); presenterRefresh();
}
function presenterJump(i){ state.lessonSlide = +i; state.presentPage = 0; state.presentPages = 1; presenterSend(); presenterRefresh(); }
function presenterReopen(){
  if(!pvOpenSlidesWindow()) toast("Your browser blocked the slides window — allow pop-ups for this site.");
  setTimeout(presenterSend, 600);
}
function presenterEnd(silent){
  state.presenting = false; clearInterval(PV.tick);
  const ch = pvChannel(); if(ch) ch.postMessage({type:"end"});
  try{ if(PV.win && !PV.win.closed) PV.win.close(); }catch(e){}
  PV.win = null;
  if(!silent){ render(); toast("Presentation ended."); }
}
function presenterTick(){
  const t = document.getElementById("pvTimer"); if(t){ const s = Math.floor((Date.now()-PV.startedAt)/1000); t.textContent = `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }
  const a = document.getElementById("pvAud"); if(a){ const live = !!(PV.win && !PV.win.closed); a.className = "pv-aud " + (live?"on":"off"); a.textContent = live ? "● Slides window open" : "● Slides window closed"; }
}
function presenterCountText(d){
  const total = buildDaySlides(d).length, pages = state.presentPages||1;
  return `Step ${(state.lessonSlide||0)+1} of ${total}` + (pages > 1 ? ` · Page ${Math.max(0,state.presentPage||0)+1} of ${pages}` : "");
}
function presenterCues(d, slide){
  const out = [];
  if(slide.type==="topic"){
    const l = d.lessons[slide.lessonIndex];
    out.push(`<h3>${esc(l.h)} <small style="font-size:12px;color:var(--ink-soft);">Part ${slide.part} of 2</small></h3>`);
    if(l.trainerCue) out.push(`<div class="tc-tag">🧑‍🏫 Trainer Cue</div><p>${esc(l.trainerCue)}</p>`);
    const disc = trainerDiscussionHtml(l); if(disc) out.push(`<b class="cue-sub">Applied Discussion Case</b>${disc}`);
    out.push(renderDiscussionScript(d, l, slide.lessonIndex));
  }else if(slide.type==="quickCheck"){
    out.push(`<h3>Quick Check</h3><p>Let the room answer first — then reveal and use the rationale.</p>`);
    (d.quickChecks||[]).filter(c=>c.afterIndex===slide.lessonIndex).forEach(c=>{
      out.push(`<p><b>${esc(c.q)}</b></p><div class="pv-ans">✓ ${esc((c.opts||[])[c.a] || "")}</div>${c.r ? `<p>${esc(c.r)}</p>` : ""}`);
    });
  }else if(slide.type==="meetClient"){
    out.push(`<h3>Meet the Case — John Doe v. Apex</h3>` + renderMeetClientTrainerGuide());
  }else if(slide.type==="discussion"){
    out.push(`<h3>Trainer Checkpoint</h3><p><b>Say:</b> "Before we close Day ${d.id}, let's step back and talk about this together."</p><p><b>Ask:</b> ${esc(d.discussionQuestion||"")}</p><p>Take 2–3 answers, connect each one to a lesson from today, then move on to the Knowledge Check.</p>`);
  }else if(slide.type==="practiceLab"){
    out.push(`<h3>Skill Builders</h3><p>Trainees complete the exercise now. Once it's finished, pause for a live debrief — have them walk through what they did, why, and where their judgment differed from the model answer.</p>`);
  }else if(slide.type==="video"){
    out.push(`<h3>Video Recap</h3><p>Play the recap video (or summarise the day's three biggest ideas if it isn't ready yet), then move to the Skill Builders.</p>`);
  }else if(slide.type==="taskOverview"){
    out.push(`<h3>Task Overview</h3><p>Walk the room through today's real-world task before the lessons start — ask who has done something like it before.</p>`);
  }
  return out.join("") || `<p class="pv-empty">No trainer cue for this slide.</p>`;
}
function presenterNextText(d){
  const slides = buildDaySlides(d), idx = state.lessonSlide||0;
  if((state.presentPages||1) > 1 && (state.presentPage||0) < state.presentPages-1) return `${esc(daySlideTitle(d, slides[idx]))} — page ${(state.presentPage||0)+2}`;
  return slides[idx+1] ? esc(daySlideTitle(d, slides[idx+1])) : "End of today's slides — Knowledge Check";
}
function renderPresenterConsole(d){
  const slides = buildDaySlides(d);
  const idx = Math.min(state.lessonSlide||0, slides.length-1); state.lessonSlide = idx;
  if(state.pvScriptsFor !== d.id){ state.pvScriptsFor = d.id; setTimeout(()=>loadSavedScripts(d.id).then(()=>presenterRefresh()), 0); }
  return `
    <div class="pv">
      <div class="pv-head">
        <div class="pv-title"><b>🖥 Presenter view</b> · Day ${d.id} — ${esc(d.title)}</div>
        <div class="pv-meta"><span id="pvCount">${presenterCountText(d)}</span><span class="pv-timer" id="pvTimer">00:00</span><span class="pv-aud on" id="pvAud">● Slides window open</span></div>
        <div class="pv-actions"><button class="btn btn-ghost btn-sm" onclick="presenterReopen()">↗ Re-open slides window</button><button class="btn btn-primary btn-sm" onclick="presenterEnd()">■ End</button></div>
      </div>
      <div class="pv-grid">
        <section>
          <div class="pv-label">Now showing to the room</div>
          <div class="pv-mirror" id="pvMirror"><iframe class="pv-frame" id="pvFrame" src="/?audience=mirror&day=${d.id}" tabindex="-1" inert title="Live copy of the slides window"></iframe></div>
          <div class="pv-nav">
            <button class="btn btn-ghost" onclick="presenterStep(-1)">← Previous</button>
            <select id="pvJump" onchange="presenterJump(this.value)" title="Jump to a slide">${slides.map((s,i)=>`<option value="${i}" ${i===idx?"selected":""}>${i+1}. ${esc(daySlideTitle(d,s))}</option>`).join("")}</select>
            <button class="btn btn-primary" onclick="presenterStep(1)">Next →</button>
          </div>
          <div class="pv-next"><b>Up next:</b> <span id="pvNext">${presenterNextText(d)}</span></div>
          <p class="pv-tip">In Google Meet: <b>Present now → A window</b> → pick <b>“LSH Slides — share this window”</b>. Keep this tab for yourself; use ← → keys here to move the slides.</p>
        </section>
        <aside class="pv-cues"><div class="pv-label">Your notes — only you can see these</div><div id="pvCues">${presenterCues(d, slides[idx])}</div></aside>
      </div>
    </div>`;
}
/* update the console in place (re-rendering would reload the live copy) */
function presenterRefresh(){
  const d = DAYS.find(x=>x.id===state.dayId); if(!d || !state.presenting) return;
  const slides = buildDaySlides(d), idx = state.lessonSlide||0;
  const c = document.getElementById("pvCount"); if(c) c.textContent = presenterCountText(d);
  const n = document.getElementById("pvNext"); if(n) n.innerHTML = presenterNextText(d);
  const j = document.getElementById("pvJump"); if(j) j.value = String(idx);
  const cu = document.getElementById("pvCues"); if(cu && cu.dataset.slide !== String(idx)){ cu.dataset.slide = String(idx); cu.innerHTML = presenterCues(d, slides[idx]); cu.parentElement.scrollTop = 0; }
}
function presenterFitMirror(){
  const box = document.getElementById("pvMirror"), f = document.getElementById("pvFrame"); if(!box || !f) return;
  const w = (PV.size && PV.size.w) || 1280, h = (PV.size && PV.size.h) || 720;
  box.style.aspectRatio = `${w} / ${h}`;
  f.style.width = w+"px"; f.style.height = h+"px";
  f.style.transform = `scale(${box.clientWidth / w})`;
}
Object.assign(window, {presenterStart, presenterStep, presenterJump, presenterReopen, presenterEnd});

/* hook the existing slide controls so arrows / buttons drive the presentation */
const __pvNextSlide = window.nextSlide, __pvPrevSlide = window.prevSlide, __pvGoToSlide = window.goToSlide;
window.nextSlide = function(){ if(state.presenting) return presenterStep(1); return __pvNextSlide(); };
window.prevSlide = function(){ if(state.presenting) return presenterStep(-1); return __pvPrevSlide(); };
window.goToSlide = function(i){ if(state.presenting) return presenterJump(i); return __pvGoToSlide(i); };
const __pvRenderDaySlideshow = window.renderDaySlideshow;
window.renderDaySlideshow = function(d){ if(state.presenting && !state.stageInnerOnly && !PV_IS_AUDIENCE) return renderPresenterConsole(d); return __pvRenderDaySlideshow(d); };
const __pvNarrAfter = window.narratorAfterRender;
window.narratorAfterRender = function(pageOnly){ if(state.presenting && state.view==="day"){ presenterFitMirror(); presenterRefresh(); return; } return __pvNarrAfter(pageOnly); };
const __pvPaginate = window.paginateLessonSlide;
window.paginateLessonSlide = function(){ if(state.presenting && !PV_IS_AUDIENCE) return; return __pvPaginate(); };
const __pvGoto2 = window.goto;
window.goto = function(view, id){ if(state.presenting && (view!=="day" || id!==state.dayId)) presenterEnd(true); return __pvGoto2(view, id); };
const __pvAfterRender2 = window.afterRender;
window.afterRender = function(){
  const r = __pvAfterRender2.apply(this, arguments);
  // the "Presenter view" button sits next to "Present full screen" (trainers only)
  const top = document.querySelector(".ls-top");
  if(top && state.isAdmin && !state.presenting && !top.querySelector(".pv-open")){
    top.insertAdjacentHTML("beforeend", `<button class="btn btn-primary btn-sm pv-open" onclick="presenterStart()" title="Share only the slides in Google Meet while you see the trainer cues here">🖥 Presenter view</button>`);
  }
  return r;
};
window.addEventListener("resize", ()=>{ if(state.presenting) presenterFitMirror(); });
if(pvChannel() && !PV_IS_AUDIENCE){
  PV.ch.addEventListener("message", (e)=>{
    const m = e.data || {}; if(!state.presenting) return;
    if(m.type==="hello") presenterSend();
    if(m.type==="key") presenterStep(m.dir);
    if(m.type==="rendered" && m.dayId===state.dayId && m.slide===(state.lessonSlide||0)){
      state.presentPage = m.page; state.presentPages = m.pages;
      if(!PV.size || PV.size.w!==m.w || PV.size.h!==m.h){ PV.size = {w:m.w, h:m.h}; presenterFitMirror(); }
      presenterRefresh();
    }
  });
  window.addEventListener("beforeunload", ()=>{ if(state.presenting && PV.ch) PV.ch.postMessage({type:"end"}); });
}

/* ----- the slides window (and its live copy) ----- */
if(PV_IS_AUDIENCE){
  const isMain = PV_MODE === "1";
  if(isMain) document.title = "LSH Slides — share this window";
  document.body.classList.add("audience-mode");
  window.render = function(){};                          // the normal portal never draws here
  window.autoPublishBlueprint = async function(){};       // leave background jobs to the trainer's own tab
  const app = document.getElementById("app"); if(app) app.innerHTML = "";
  const root = document.createElement("div"); root.id = "audienceRoot";
  root.innerHTML = `<div class="aud-wait"><b>LSH Case Management Training</b>Waiting for the presenter…</div>`;
  document.body.appendChild(root);
  // arrow keys pressed in the slides window (or while the live copy holds focus) drive the presentation
  document.addEventListener("keydown", (e)=>{
    const dir = ["ArrowRight","PageDown"," "].includes(e.key) ? 1 : (["ArrowLeft","PageUp"].includes(e.key) ? -1 : 0);
    if(dir && pvChannel()){ e.preventDefault(); PV.ch.postMessage({type:"key", dir}); }
  });
  if(isMain){
    const hint = document.createElement("div"); hint.className = "aud-hint"; hint.textContent = "Share this window in Google Meet · double-click for full screen";
    document.body.appendChild(hint); setTimeout(()=>hint.classList.add("gone"), 7000);
    document.addEventListener("dblclick", ()=>{ if(document.fullscreenElement) document.exitFullscreen(); else if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{}); });
  }
  let last = null;
  const show = (m)=>{
    const d = DAYS.find(x=>x.id===m.dayId); if(!d) return;
    last = m;
    // view is "audience", not "day", so the portal's own arrow-key handler stays out of it
    state.view = "audience"; state.dayId = d.id; state.lessonSlide = m.slide; state.maxSlideReached = 9999;
    state.slidePage = m.page; state.slidePageKey = d.id+":"+m.slide; state.slideDir = "next";
    state.stageInnerOnly = true;
    root.innerHTML = `<div class="lesson-stage" id="lessonStage">${renderDaySlideshow(d)}</div>`;
    state.stageInnerOnly = false;
    decorateCallouts(root);
    paginateLessonSlide();
    if(isMain) pvChannel().postMessage({type:"rendered", dayId:d.id, slide:m.slide, page:state.slidePage||0, pages:state.slidePages||1, w:root.clientWidth, h:root.clientHeight});
  };
  if(pvChannel()){
    PV.ch.addEventListener("message", (e)=>{
      const m = e.data || {};
      if(m.type==="show") show(m);
      if(m.type==="end") root.innerHTML = `<div class="aud-wait"><b>Thanks for joining</b>The presentation has ended.</div>`;
    });
    PV.ch.postMessage({type:"hello"});
  }
  let rt = null;
  const reshow = ()=>{ clearTimeout(rt); rt = setTimeout(()=>{ if(last) show(last); }, 200); };
  window.addEventListener("resize", reshow);
  document.addEventListener("fullscreenchange", reshow);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(reshow);
}

/* ---------- 5. Lessons fully centred · Orientation + Blueprint refresh ---------- */
(function(){ const s = document.createElement("style"); s.id = "eapa-update-centre"; s.textContent = `
.lesson-stage #lessonSlideWrap .lesson-card, .lesson-stage #lessonSlideWrap .meet-client-card, .lesson-stage #lessonSlideWrap > .card, .lesson-stage #lessonSlideWrap .qcheck-card, .lesson-stage #lessonSlideWrap .video-placeholder, .lesson-stage #lessonSlideWrap .discussion-card{text-align:center;}
.lesson-stage #lessonSlideWrap .fp-label{justify-content:center;}
.lesson-stage #lessonSlideWrap .fp-label::before{content:"";flex:1;height:1px;background:#EADFD2;}
.lesson-stage #lessonSlideWrap p{margin-left:auto;margin-right:auto;}
.lesson-stage #lessonSlideWrap .fp-body > p, .lesson-stage #lessonSlideWrap .fp-body > div > p{max-width:80ch;}
.lesson-stage #lessonSlideWrap .lesson-card li, .lesson-stage #lessonSlideWrap .meet-client-card li{padding-left:0;text-align:center;}
.lesson-stage #lessonSlideWrap .lesson-card ul > li::before, .lesson-stage #lessonSlideWrap .meet-client-card ul > li::before{position:static;display:inline-block;width:9px;height:9px;margin:0 10px 2px 0;vertical-align:middle;}
.lesson-stage #lessonSlideWrap .meet-client-card ul{list-style:none;padding:0;}
.lesson-stage #lessonSlideWrap ol.fp-howto-list > li, .lesson-stage #lessonSlideWrap .fp-section ol > li{text-align:center;padding-top:20px;}
.lesson-stage #lessonSlideWrap ol.fp-howto-list > li::before, .lesson-stage #lessonSlideWrap .fp-section ol > li::before{left:50%;transform:translateX(-50%);}
.lesson-stage #lessonSlideWrap .vis-card{text-align:center;} .lesson-stage #lessonSlideWrap .vis-card-top{justify-content:center;gap:10px;}
.lesson-stage #lessonSlideWrap .callout, .lesson-stage #lessonSlideWrap [class*="callout"]{text-align:center;}
.lesson-stage #lessonSlideWrap table{margin-left:auto;margin-right:auto;text-align:left;}
.lesson-stage #lessonSlideWrap .quiz-opt{text-align:center;justify-content:center;align-items:center;}
.lesson-stage #lessonSlideWrap .qcheck-card .qc-tag{justify-content:center;}
.lesson-stage #lessonSlideWrap .lx-panel, .lesson-stage #lessonSlideWrap details{text-align:center;}
.build-tag .eapa-ok{color:#3F7D58;font-weight:700;}
`; document.head.appendChild(s); })();

/* Orientation deck (and the Blueprint PDF, which is built from it and republishes
   itself when the build changes): explain split pages and live sessions. */
const __eapaOrientSlides = window.orientSlides;
window.orientSlides = function(){
  const slides = __eapaOrientSlides();
  const i = slides.findIndex(x=>x.k==="A day");
  if(i >= 0){
    slides[i] = Object.assign({}, slides[i], {body: slides[i].body.replace("One topic at a time. Next / Previous at the bottom; your place is saved.", "One topic at a time, every slide the same size. Longer topics continue on a second page — watch for the PAGE 1 / 2 badge. Your place is saved.")});
    const pill = (ic,t,d)=>`<div class="or-pill"><div>${ic}</div><b>${t}</b><span>${d}</span></div>`;
    slides.splice(i+1, 0, {k:"Live sessions", h:"Live sessions with your trainer", body:`
     <div class="or-3">${pill("🖥","Follow the shared slides","Your trainer presents the day's slides in Google Meet. They're the same slides you have in the portal — nothing extra to install.")}${pill("💬","Talk it through","At each checkpoint your trainer pauses for discussion. Answer out loud — a first answer is never wrong, it's where the learning starts.")}${pill("📄","Pages & pace","Longer topics have a second page (PAGE 1 / 2). On your own, use Next or the ← → keys, 🔊 Listen, or ⛶ Full screen.")}</div>
     <div class="or-note"><b>Missed something live?</b> Every slide stays in your portal — reopen the day any time and pick up exactly where you left off.</div>`});
  }
  return slides;
};

/* footer: shows at a glance that this update pack is running */
const __eapaAfterRender3 = window.afterRender;
window.afterRender = function(){
  const r = __eapaAfterRender3.apply(this, arguments);
  const tag = document.querySelector(".build-tag");
  if(tag && !tag.querySelector(".eapa-ok")) tag.insertAdjacentHTML("beforeend", ` · <span class="eapa-ok">updates ✓</span>`);
  return r;
};

/* (EA/PA-only labs — Email Outreach, the Gmail inbox, Proactive EA Tasks — are not part of the CM course.) */

/* ---------- 9. Practice Lab pages in the platform's page style ----------
   Lab pages get the same navy hero banner as every other page (day kicker,
   serif title, summary, save / return controls and status chips), then a
   standard body: activity tabs on a rail, an "Activity N of M" kicker +
   serif heading per activity, readable instructions, uniform cards and
   clear primary buttons. A small polisher applies this to whatever each
   lab renders, so the labs' own logic is untouched. */
(function(){ const s = document.createElement("style"); s.id = "eapa-lab-style"; s.textContent = `
.lab-hero{margin-top:10px;}
.lab-hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;}
.lab-hero-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.lab-hero .lab-save-status{color:#9FE0B8;font-size:12.5px;font-weight:700;}
.lab-hero .lab-hbtn{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.28);}
.lab-hero .lab-hbtn:hover{background:rgba(255,255,255,.2);}
.lab-hero h1 .lab-ic{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:rgba(240,192,138,.16);border:1px solid rgba(240,192,138,.35);font-size:22px;margin-right:10px;vertical-align:middle;}
.lab-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;}
.lab-chips span{font-size:12.5px;font-weight:700;border-radius:999px;padding:5px 12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#E4E7F5;}
.lab-chips span.ok{background:rgba(88,190,130,.18);border-color:rgba(143,224,174,.45);color:#9FE0B8;}
.lab-shell{padding:22px 28px 26px;}
.lab-shell .wizard-tabs{background:#F6F4EF;border-radius:16px;padding:8px;margin:0 0 20px;}
.lab-shell .wizard-part-label{display:none;}
.lab-kicker{font-family:'IBM Plex Mono',monospace;font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--orange-deep);margin:0 0 4px;display:flex;align-items:center;gap:10px;}
.lab-kicker::after{content:"";flex:1;height:1px;background:#EADFD2;}
#toolBody h3{font-family:'Fraunces',Georgia,serif !important;color:var(--navy) !important;font-size:21px !important;line-height:1.25;margin:0 0 8px !important;font-weight:700;}
#toolBody h3.lab-sub{font-size:18px !important;margin-top:30px !important;}
#toolBody .wizard-screen > p, #toolBody p[style*="font-size:12"], #toolBody p[style*="font-size:13px"]{font-size:14.5px !important;line-height:1.6 !important;color:#4A4E63 !important;max-width:90ch;}
#toolBody li[style*="font-size:12"], #toolBody li[style*="font-size:13px"], #toolBody label[style*="font-size:12"]{font-size:14px !important;line-height:1.55;}
#toolBody .card{border-radius:14px;border:1px solid var(--line);box-shadow:0 1px 2px rgba(31,36,64,.05);}
#toolBody .card[style*="#F8F9FC"], #toolBody .card[style*="#FFFBF3"], #toolBody .card[style*="#FFFCF8"]{border-left:4px solid var(--orange) !important;background:#FFFBF5 !important;}
#toolBody textarea, #toolBody input[type="text"], #toolBody input:not([type]), #toolBody select{border-radius:10px;}
#toolBody textarea:focus, #toolBody input:focus, #toolBody select:focus{outline:2px solid rgba(219,132,55,.35);outline-offset:1px;border-color:var(--orange);}
#toolBody .btn.lab-cta{background:var(--navy) !important;color:#fff !important;border:1px solid var(--navy) !important;font-size:14px !important;padding:10px 20px !important;border-radius:10px !important;font-weight:700;}
#toolBody .btn.lab-cta:hover{background:#2B3158 !important;}
#toolBody .btn.lab-cta[disabled]{opacity:.55;}
.lab-shell .wizard-nav{border-top:1px solid var(--line);padding-top:16px;margin-top:26px;}
/* Practice Lab list: same card language as the dashboard */
.tool-card .tool-open-btn{background:var(--navy);color:#fff;border-color:var(--navy);border-radius:10px;padding:11px;font-size:14px;}
.tool-card:hover .tool-open-btn{background:var(--orange);border-color:var(--orange);}
.tool-card .tool-status-row{font-weight:700;font-size:12.5px;border-radius:999px;padding:4px 10px;align-self:flex-start;background:#F3F4F9;}
.tool-card .tool-status-row.st-done{background:#EAF6EF;}
.tool-card .tool-desc2{font-size:13.5px;line-height:1.5;}
.tool-card.locked .tool-open-btn{background:#EEF0F6;color:var(--ink-soft);border-color:#EEF0F6;}
@media(max-width:760px){.lab-shell{padding:16px 14px;} .lab-hero h1 .lab-ic{width:36px;height:36px;font-size:18px;}}
`; document.head.appendChild(s); })();

window.toolHead = function(t){
  const d = t.relates ? parseInt(String(t.relates).replace(/[^0-9]/g,""), 10) : null;
  return `
    <a class="back-link" onclick="goto('practice')">&larr; Back to Skill Builders</a>
    <section class="page-hero lab-hero">
      <div class="lab-hero-top">
        <p class="eyebrow">${d ? `Day ${d} · Skill Builder` : "Skill Builder"}</p>
        <div class="lab-hero-actions">
          <span class="lab-save-status" id="labSaveStatus">💾 Auto-save on</span>
          <button class="btn btn-sm lab-hbtn" onclick="saveLabNow()">💾 Save</button>
          ${d ? `<button class="btn btn-sm lab-hbtn" onclick="returnToLessonCard(${d})">Return to Progress</button>` : ""}
        </div>
      </div>
      <h1><span class="lab-ic">${t.icon}</span>${esc(t.title)}</h1>
      <p>${esc(t.desc)}</p>
      <div class="lab-chips" id="labChips">${labChipsHtml(t)}</div>
    </section>
    <div class="card tool-shell lab-shell"><div id="toolBody"></div></div>`;
};
function labChipsHtml(t){
  const p = (state.practiceProgress||{})[t.id];
  const n = (toolState && toolState.wizardLabels) ? toolState.wizardLabels.length : 0;
  const left = typeof labAttemptsRemaining==="function" ? labAttemptsRemaining() : null;
  return (n ? `<span>🧩 ${n} activities</span>` : "")
    + (p ? `<span class="ok">✓ Best score ${p.bestScore}% · ${p.runs} run${p.runs===1?"":"s"}</span>` : `<span>◻ Not started</span>`)
    + (left!=null ? `<span>🔁 ${left} of ${LAB_ATTEMPT_CAP} repeat attempts left</span>` : "")
    + `<span>🆓 First try of each exercise is free</span>`;
}
const LAB_CTA = /^\s*(check|submit|get review|get evaluation|get feedback|finish|evaluate|grade|review my|send for review)/i;
function labPolish(){
  const body = document.getElementById("toolBody"); if(!body) return;
  const screens = [...body.querySelectorAll(".wizard-screen")];
  const n = screens.length;
  // every activity opens with "Activity N of M" + a heading (its own, or the tab name)
  const labels = (toolState && toolState.wizardLabels) || [];
  screens.forEach((screen,i)=>{
    if(screen.dataset.labPolished) return; screen.dataset.labPolished = "1";
    const first = screen.firstElementChild;
    if(first && first.tagName==="H3") first.dataset.labLead = "1";
    else screen.insertAdjacentHTML("afterbegin", `<h3 data-lab-lead="1">${esc(labels[i]||"")}</h3>`);
    screen.querySelector("h3[data-lab-lead]").insertAdjacentHTML("beforebegin", `<div class="lab-kicker">Activity ${i+1} of ${n}</div>`);
  });
  // drop the old "A. / B." letter prefixes; later headings become sub-headings
  body.querySelectorAll("h3").forEach(h=>{
    if(h.dataset.labPolished) return; h.dataset.labPolished = "1";
    const tn = [...h.childNodes].find(x=>x.nodeType===3 && x.textContent.trim());
    if(tn) tn.textContent = tn.textContent.replace(/^\s*[A-H]\.\s+/, "");
    if(!h.dataset.labLead && h.closest(".wizard-screen")) h.classList.add("lab-sub");
  });
  body.querySelectorAll("button.btn").forEach(b=>{ if(!b.dataset.labCta && LAB_CTA.test(b.textContent||"") && !b.closest(".wizard-nav") && !b.closest(".gm")){ b.dataset.labCta = "1"; b.classList.add("lab-cta"); } });
  const chips = document.getElementById("labChips"), t = PRACTICE_TOOLS.find(x=>x.id===state.toolId);
  if(chips && t){ const html = labChipsHtml(t); if(chips.innerHTML !== html) chips.innerHTML = html; }
}
let __labObs = null, __labT = null;
const __eapaAfterRender4 = window.afterRender;
window.afterRender = function(){
  const r = __eapaAfterRender4.apply(this, arguments);
  if(__labObs){ __labObs.disconnect(); __labObs = null; }
  const body = state.view==="tool" && document.getElementById("toolBody");
  if(body){
    labPolish();
    __labObs = new MutationObserver(()=>{ clearTimeout(__labT); __labT = setTimeout(labPolish, 40); });
    __labObs.observe(body, {childList:true, subtree:true});
  }
  return r;
};

/* ---------- 10. SOP: how to facilitate — program flow + a run of show per day ----------
   Trainer-only. The run of show is built from each day's live content (topics,
   Quick Checks, Practice Lab activities, discussion question, Knowledge Check),
   so it always matches what trainees see. Clock times follow a start time the
   trainer picks. Never shown in Present mode. */
const SOP_LAB_ACTIVITIES = {
  cmIntake1:["Intake Packet Audit","Decision & Documentation","Applied Case Manager Actions"],
  cmTreatment1:["Red Flags & Variance","Eggshell Plaintiff Memo","The Transportation Wall"],
  cmPreDemand2:["Kill the “Low-Speed” Argument","Reframe the 14-Day Gap","Real-Time Demand Audit"],
  cmNegotiate2:["The Math Check","Break the Adjuster","The Pincer & the Release"],
  cmLien3:["UM Bad-Faith Scenario","The Final Net Challenge","Zero-Recovery Letter"],
  cmClosing3:["Reconcile the $150,000","Audit-Ready?","Closing Letter & Plot Twist"],
  cmMediation4:["Mediation Logistics","Build the Binder","Pre-Mediation Audit"],
  cmArbitration4:["Sort the Scrambled File","Quality Control","Defeat the Pre-Existing Defense"],
  calendar:["Calendar Conflict Resolver","Docket Briefing for the Attorney","Proactive CM Tasks","Hard-Code the Arbitration Dates"],
  cmLitigation5:["Deadline Calculator","File Architecture","KPI Docket Audit","Deposition Prep"],
  cmJordan5:["Phase 1 — Find the Coverage","Phase 2 — The Call","Phase 3 — Fight the 50/50"]
};
(function(){ const s = document.createElement("style"); s.id = "eapa-sop-flow"; s.textContent = `
.sopf{padding:22px 26px;margin-bottom:16px;border-top:6px solid var(--orange);}
.sopf-head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:6px;}
.sopf-head h2{font-family:'Fraunces',Georgia,serif;color:var(--navy);font-size:24px;margin:2px 0 0;}
.sopf-meta{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 16px;} .sopf-meta span{background:#F3F4F9;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:700;color:var(--navy);}
.sopf-start{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-soft);} .sopf-start input{font:inherit;font-size:13px;border:1px solid var(--line);border-radius:8px;padding:5px 8px;}
.sopf-steps{list-style:none;margin:0;padding:0;counter-reset:sf;}
.sopf-steps > li{display:grid;grid-template-columns:118px minmax(0,1fr);gap:16px;padding:14px 0;border-top:1px dashed #E3DDD2;}
.sopf-time{font-family:'IBM Plex Mono',monospace;font-size:12.5px;font-weight:700;color:var(--orange-deep);line-height:1.5;}
.sopf-time small{display:block;color:var(--ink-soft);font-weight:600;}
.sopf-step h4{margin:0 0 6px;font-size:16px;color:var(--navy);display:flex;align-items:center;gap:8px;}
.sopf-step h4 .n{counter-increment:sf;} .sopf-step h4 .n::before{content:counter(sf);display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--navy);color:#fff;font-size:12px;}
.sopf-rows{display:grid;gap:5px;font-size:14px;line-height:1.55;}
.sopf-rows div{display:grid;grid-template-columns:92px minmax(0,1fr);gap:10px;}
.sopf-rows > div > b{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);padding-top:3px;} .sopf-rows li b{color:var(--navy);}
.sopf-rows ul{margin:0;padding-left:18px;}
.sopf-step.brk h4{color:#3F7D58;} .sopf-step.brk h4 .n::before{background:#3F7D58;}
.sopf-step.opt h4::after{content:"Optional";font-size:11px;font-weight:700;color:#B06000;background:#FFF1E2;border-radius:999px;padding:2px 8px;}
.sopf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;}
.sopf-card{padding:18px 20px;} .sopf-card h3{font-family:'Fraunces',Georgia,serif;color:var(--navy);font-size:19px;margin:0 0 10px;}
.sopf-card ol, .sopf-card ul{margin:0;padding-left:20px;font-size:14px;line-height:1.6;} .sopf-card li{margin-bottom:6px;}
.sopf-map td, .sopf-map th{font-size:13.5px;vertical-align:top;}
@media(max-width:760px){.sopf-steps > li{grid-template-columns:1fr;gap:6px;} .sopf-rows div{grid-template-columns:1fr;}}
@media print{.topbar, .admin-tabs, .sopx-bar, .page-hero, .footer-note, .sopx-toc, .sopf-start{display:none !important;} .sopf{box-shadow:none;border:1px solid #ccc;}}
`; document.head.appendChild(s); })();

function sopClock(startMin, off){ const t = startMin + off; const h = Math.floor(t/60)%24, m = t%60; return `${h%12||12}:${String(m).padStart(2,"0")} ${h<12?"AM":"PM"}`; }
function sopStartMin(){ const v = state.sopStart || "09:00"; const [h,m] = v.split(":").map(Number); return (h||9)*60 + (m||0); }
function setSopStart(v){ state.sopStart = v; try{ localStorage.setItem("lsh_sop_start", v); }catch(e){} render(); }
try{ state.sopStart = state.sopStart || localStorage.getItem("lsh_sop_start") || "09:00"; }catch(e){}
function sopRunOfShow(dRaw){
  const d = DAYS.find(x=>x.id===dRaw.id); if(!d) return "";
  const tools = relatedTools(d.id), lab = tools[0];
  const acts = lab ? (SOP_LAB_ACTIVITIES[lab.id] || []) : [];
  const n = d.lessons.length, qcs = (d.quickChecks||[]).slice().sort((a,b)=>a.afterIndex-b.afterIndex);
  const kc = (d.quiz||[]).length;
  const steps = []; let t = 0;
  const add = (mins, s)=>{ steps.push(Object.assign({from:t, to:t+mins}, s)); t += mins; };
  add(15, {pre:true, title:"Before trainees join", do:[
    `Admin → <b>Trainee Audit</b>: approve anyone new; check everyone has Day ${d.id} unlocked (the previous day's work submitted).`,
    `Open <b>Admin → Trainer Cues → Day ${d.id}</b> in a second window, or use Presenter view (below) which shows the cues for each slide.`,
    `Open Day ${d.id} → slides → <b>🖥 Presenter view</b>. Allow pop-ups. In Google Meet: <b>Present now → A window</b> → “LSH Slides — share this window”.`,
    `Pick your random-task moment (step marked below) and how long trainees get (15–30 min).`]});
  add(5, {title:"Welcome, recap & today's objectives", do:[
    `Show the <b>📋 Objectives</b> page (button above the slides) — it lists what trainees will be able to do by the end of today.`,
    `Recap yesterday in one minute: the 1–2 things most people found hard (check Rankings / Knowledge Check scores).`],
    say:`“By the end of today you'll be able to ${esc(String(d.objective||d.title).replace(/\.$/,"").replace(/^[A-Z](?=[a-z])/, c=>c.toLowerCase()))}.”`,
    watch:"Anyone who hasn't opened today's day yet — ask them to open it now so they can follow along."});
  if(d.id===1) add(8, {title:"Meet the Case — John Doe v. Apex", do:[`On the <b>Meet the Case</b> slide, open the three “Start here” documents (intake summary, police report, intake sheet) and walk the room through the facts of loss in 5–8 minutes.`, `Ask: “What would you verify first, and where would you record it?” Take two answers, then point them to 📂 <b>Case File</b> and 📁 <b>Case Documents</b> — every Skill Builder uses these files.`], watch:"Trainees accepting the summary at face value — remind them the documents contain deliberate errors they're expected to catch."});
  // teaching blocks of ~45 minutes, with the Quick Checks where they fall and breaks in between
  const perTopic = 2.5, blockTopics = Math.max(8, Math.round(45/perTopic));
  let i = 0, block = 1; const blocks = Math.ceil(n/blockTopics);
  const midBlock = Math.max(1, Math.ceil(blocks/2));
  const taskStep = {opt:true, title:"Send today's random task", do:[`Admin → <b>Trainee Audit → 🎲 Random Task Injection</b>: choose <b>Day ${d.id}</b>, set 15–30 minutes, <b>Generate &amp; Broadcast</b>. Keep teaching — trainees handle it in 🎲 Tasks alongside the session.`, `Anyone who doesn't submit before the timer ends gets it logged as Missed (0).`]};
  while(i < n){
    const j = Math.min(n, i+blockTopics);
    if(block===midBlock+1) add(0, taskStep);   // right after the break, as teaching resumes
    const inBlock = qcs.filter(q=>q.afterIndex>=i && q.afterIndex<j);
    add(Math.round((j-i)*perTopic + inBlock.length*1.5), {title:`Teach topics ${i+1}–${j} of ${n}`, do:[
      `Present each topic's two parts (principles & steps, then best practices & pitfalls). Longer topics continue on a second page — press Next.`,
      `Use your notes for each slide: the Trainer Cue, Applied Discussion Case and the Say / Ask / Listen for / If quiet script. Take one or two answers per topic, not a round-robin.`,
      inBlock.length ? `Quick Check${inBlock.length>1?"s":""} after topic${inBlock.length>1?"s":""} ${inBlock.map(q=>q.afterIndex+1).join(", ")}: let the room answer first, then reveal (the answer and rationale are in your notes).` : "",
      `Topics: ${d.lessons.slice(i,j).map((l,k)=>`${i+k+1}. ${esc(l.h)}`).join(" · ")}`].filter(Boolean),
      watch:"Silence usually means the example is too abstract — use the Applied Discussion Case from your notes."});
    i = j; block++;
    if(i >= n && blocks===1) add(0, taskStep);
    if(i < n) add(10, {brk:true, title:"Break", do:["10 minutes. Tell the room the exact time you'll restart."]});
  }
  add(5, {title:"Video recap", do:["Play the day's recap video on the Video slide (or, until it's added, summarise the three biggest ideas in one minute each)."]});
  // every Skill Builder for the day: the first runs live, later ones can finish after the session
  tools.forEach((tool, ti)=>{
    const parts = SOP_LAB_ACTIVITIES[tool.id] || [];
    add(Math.max(20, parts.length*10), {opt: ti>0, title:`Skill Builder — ${esc(tool.title)}`, do:[
      `Trainees open it from the Skill Builders slide (or <b>Skill Builders</b> in the top bar). They work in their own portal with the case documents; stop presenting or leave the Skill Builders slide up.`,
      parts.length ? `Parts (≈10 min each): ${parts.map((a,k)=>`<b>${k+1}. ${esc(a)}</b>`).join(" · ")}.` : "",
      ti>0 ? `If time is short, trainees finish this one after the session; debrief it at the start of tomorrow.` : "",
      /Roleplay|The Call|Transportation Wall|Break the Adjuster|Deposition Prep/i.test(parts.join(" ")) ? `The live roleplay part can be run by you, or trainees rehearse solo first.` : "",
      `Steps marked <b>Do this in the CMS</b> are done in the LSH Case Management System (🧰 Tools); trainees log the Case ID.`,
      `First submission of each exercise is free; repeats use one of 3 program-wide attempts (reset in Trainee Audit if someone is blocked by a technical issue).`].filter(Boolean),
      watch:"Anyone stuck on the same part for more than 10 minutes — nudge them to submit and move on; the debrief is where the learning lands."});
  });
  if(tools.length) add(10, {title:"Skill Builders debrief", do:[`Ask 2–3 trainees to walk through what they did and why, and where their judgment differed from the answer key or model answer.`, `Point to the Evaluation Report's “Not this way — what to change” section: it's the next step, not a verdict.`]});
  if(d.discussionQuestion) add(8, {title:"End-of-day discussion", say:`“Before we close Day ${d.id}, let's step back and talk about this together: ${esc(d.discussionQuestion)}”`, do:[`Take 2–3 answers, connect each one to a lesson from today, then move on.`]});
  add(10, {title:`Knowledge Check (${kc} questions)`, do:[`Trainees click <b>Continue to Knowledge Check</b> on the last slide. 70% marks the day complete ✓.`, `Below 70% is a “not yet”: they can still move on and retake it any time; their best score counts.`], watch:"Stop presenting while they answer, so no one reads answers off the shared screen."});
  add(5, {title:"Close", do:[`Ask everyone to send quick feedback with the 💬 Feedback button.`, `Preview tomorrow: Day ${d.id+1<=DAYS.length ? `${d.id+1} — ${esc((DAYS.find(x=>x.id===d.id+1)||{}).title||"")}` : "certificates and wrap-up"}.`, `Click <b>■ End</b> in Presenter view.`]});
  add(20, {pre:true, title:"After the session", do:[
    `<b>Trainee Audit → View Detail → Day-by-Day Feedback</b>: review each trainee's Day ${d.id} feedback, edit and <b>Send</b>.`,
    `Add a <b>🎯 Focus</b> item for anyone who needs one specific next step.`,
    `Check <b>Rankings</b> and the Knowledge Check column; schedule retakes for anyone under 70%.`,
    `Read <b>Trainee Feedback</b> for today and note one thing to change tomorrow.`]});
  const start = sopStartMin(), live = steps.filter(s=>!s.pre), liveMins = live.reduce((a,s)=>a+(s.to-s.from),0);
  const rows = steps.map(s=>{
    const from = s.pre && s.title==="Before trainees join" ? -15 : s.from - 15;
    const to = from + (s.to-s.from);
    const when = s.pre && s.title==="After the session" ? `After<small>≈20 min</small>` : (s.to===s.from ? `${sopClock(start, from)}<small>as teaching resumes</small>` : `${sopClock(start, from)}<small>${s.to-s.from} min</small>`);
    const cls = s.brk ? "brk" : (s.opt ? "opt" : "");
    return `<li><div class="sopf-time">${when}</div><div class="sopf-step ${cls}"><h4><span class="n"></span>${s.title}</h4><div class="sopf-rows">
      ${s.do && s.do.length ? `<div><b>Do</b><ul>${s.do.map(x=>`<li>${x}</li>`).join("")}</ul></div>` : ""}
      ${s.say ? `<div><b>Say</b><span>${s.say}</span></div>` : ""}
      ${s.watch ? `<div><b>Watch for</b><span>${esc(s.watch)}</span></div>` : ""}
    </div></div></li>`;
  }).join("");
  const endClock = sopClock(start, liveMins);
  return `<section class="card sopf">
    <div class="sopf-head"><div><div class="sopx-kicker">Day ${d.id} · How to run this session</div><h2>Run of show</h2></div>
      <label class="sopf-start">Session starts at <input type="time" value="${esc(state.sopStart||"09:00")}" onchange="setSopStart(this.value)"> <button class="btn btn-ghost btn-sm" onclick="window.print()">🖨 Print</button></label></div>
    <div class="sopf-meta"><span>⏱ About ${Math.round(liveMins/60*10)/10} hours live · ends ≈ ${endClock}</span><span>📚 ${n} topics</span><span>✔ ${qcs.length} Quick Checks</span>${tools.length?`<span>🧪 ${tools.length} Skill Builder${tools.length>1?"s":""}</span>`:""}<span>📝 ${kc}-question Knowledge Check</span></div>
    <ol class="sopf-steps">${rows}</ol>
    <p style="font-size:12.5px;color:var(--ink-soft);margin:12px 0 0;">Timings assume about 2½ minutes per topic. Built from the live portal content, so it updates automatically when topics are added in Content Studio. The detailed script for each day follows below.</p>
  </section>`;
}
function sopProgramFlow(){
  const days = DAYS.map(d=>{ const tl = relatedTools(d.id); return `<tr><td><b>Day ${d.id}</b></td><td>${esc(d.title)}</td><td>${d.lessons.length}</td><td>${tl.length?tl.map(t=>esc(t.title)).join("<br>"):"—"}</td><td><button class="btn btn-ghost btn-sm" onclick="setSopDay(${d.id})">Run of show →</button></td></tr>`; }).join("");
  return `
    <section class="card sopf"><div class="sopx-kicker">Trainer reference · The whole program</div><h2 style="font-family:'Fraunces',Georgia,serif;color:var(--navy);font-size:26px;margin:4px 0 8px;">How to facilitate the LSH Case Management Training</h2>
      <p style="font-size:14.5px;line-height:1.6;margin:0;max-width:85ch;">Five live sessions, one realistic case file (John Doe v. Apex Delivery Services; Day 5 adds Jordan Davies), one rhythm every day: <b>teach → check → practise → debrief → assess → follow up</b>. This page is the big picture; open any day for its minute-by-minute run of show.</p></section>
    <div class="sopf-grid">
      <section class="card sopf-card"><h3>1 · Before the program</h3><ol>
        <li>Open <b>/version</b> on the portal: it should show the current build and <b>AI provider: Google Gemini</b>. If not, add <code>GEMINI_API_KEY</code> in Cloudflare.</li>
        <li>Sign in to <b>🛡 Admin</b>. In Trainee Audit set the certificate signatories and the daily-review setting.</li>
        <li>Send trainees the portal link. They register with name + batch code; <b>approve them in Trainee Audit</b>.</li>
        <li>Rehearse once: open Day 1 → <b>🖥 Presenter view</b>, share the slides window in a test Meet, step through a few slides.</li>
        <li>Try <b>👁 Trainee view</b> (top bar) to see exactly what trainees see, then switch back.</li></ol></section>
      <section class="card sopf-card"><h3>2 · Kick-off (≈20 min, before Day 1)</h3><ol>
        <li>Admin → <b>🧭 Orientation</b> → <b>Present full screen</b>. It covers the roadmap, how a day works, live sessions, the dashboard, grading and ground rules.</li>
        <li>Share the <b>Blueprint PDF</b> (link on the Orientation page) as the take-home version.</li>
        <li>Everyone reads the <b>Case File</b> before Day 1 and knows where <b>📁 Case Documents</b> are — every Skill Builder is graded against those documents.</li></ol></section>
      <section class="card sopf-card"><h3>3 · Every day, the same rhythm</h3><ol>
        <li><b>Before:</b> approvals, unlocks, open Presenter view (≈15 min early).</li>
        <li><b>Open:</b> recap + today's objectives (5 min).</li>
        <li><b>Teach:</b> topics in ~45-minute blocks with breaks; Quick Checks where they fall; one random task mid-way.</li>
        <li><b>Practise:</b> the day's Skill Builders (with the CMS steps), then a live debrief.</li>
        <li><b>Discuss:</b> the end-of-day question.</li>
        <li><b>Assess:</b> Knowledge Check (70% = day complete).</li>
        <li><b>Close:</b> feedback button, preview tomorrow.</li></ol></section>
      <section class="card sopf-card"><h3>4 · Between sessions</h3><ul>
        <li>Send each trainee's <b>Day-by-Day Feedback</b> (Trainee Audit → View Detail).</li>
        <li>Set <b>🎯 Focus</b> items for anyone who needs a specific next step.</li>
        <li>Check <b>Rankings</b>, Knowledge Check scores and Missed tasks; schedule retakes under 70%.</li>
        <li>Reset <b>Skill Builder attempts</b> only for technical problems.</li>
        <li>Read <b>Trainee Feedback</b> and adjust the next session.</li></ul></section>
      <section class="card sopf-card"><h3>5 · Program close</h3><ul>
        <li>Certificates unlock when all ${DAYS.length} Knowledge Checks are passed (70%+); “With Distinction” at a 90%+ average.</li>
        <li>Check names in Trainee Audit — the certificate uses the registered name exactly.</li>
        <li>Generate each trainee's review (Rankings → AI review) and send final feedback.</li>
        <li>Export Trainee Feedback (CSV) for the program retrospective.</li></ul></section>
    </div>
    <section class="card sopf-card" style="margin-top:14px;"><h3>I want to… → go here</h3>
      <table class="log-table sopx-table sopf-map"><thead><tr><th>I want to…</th><th>Where</th></tr></thead><tbody>
        <tr><td>Share only the slides while I see my notes</td><td>Day → slides → <b>🖥 Presenter view</b></td></tr>
        <tr><td>See cues, discussion cases and scripts for a day</td><td>Admin → <b>Trainer Cues</b> (or Presenter view)</td></tr>
        <tr><td>Show the day's plan to the room</td><td>Admin → SOP Reference → <b>🎤 Present</b></td></tr>
        <tr><td>Drop an unannounced task on trainees</td><td>Admin → Trainee Audit → <b>🎲 Random Task Injection</b></td></tr>
        <tr><td>Approve, reset attempts, write feedback, set focus</td><td>Admin → <b>Trainee Audit</b> → View Detail</td></tr>
        <tr><td>See who is ahead or behind</td><td>Admin → <b>Rankings</b></td></tr>
        <tr><td>Add or improve lesson content</td><td>Admin → <b>Content Studio</b></td></tr>
        <tr><td>Read what trainees think of the program</td><td>Admin → <b>Trainee Feedback</b></td></tr>
        <tr><td>See the portal as a trainee does</td><td>Top bar → <b>👁 Trainee view</b></td></tr>
        <tr><td>See the planted errors in each case document</td><td><b>📁 Documents</b> signed in as admin (red 🔑 trainer key under each file)</td></tr>
        <tr><td>Check a trainee's file work in the CMS</td><td><b>🧰 Tools</b> → LSH Case Management System (trainees log their Case ID in each Skill Builder)</td></tr>
        <tr><td>Run extra call, email or calendar practice</td><td><b>🛠 Simulators</b> (the LSH Training Portal's shared simulators, opened for CM)</td></tr>
      </tbody></table></section>
    <section class="card sopf-card" style="margin-top:14px;"><h3>The ${DAYS.length} days</h3>
      <table class="log-table sopx-table sopf-map"><thead><tr><th>Day</th><th>Title</th><th>Topics</th><th>Skill Builders</th><th></th></tr></thead><tbody>${days}</tbody></table></section>`;
}
window.setSopStart = setSopStart;

/* ---------- CM overrides ----------
   The SOP for each day is generated from the live CM content (the course has no
   hand-written SOP). Name every Skill Builder in the objectives, and replace the
   EA/PA client roleplay guide with a "Meet the Case" guide for the Day 1 slide. */
const __cmSopForDay = window.sopForDay;
window.sopForDay = function(id){
  const out = __cmSopForDay(id);
  if(!out || out.handWritten) return out;
  const tl = relatedTools(id);
  out.objectives = [ (DAYS.find(x=>x.id===id)||{}).objective || out.objectives[0], out.objectives[1],
    tl.length ? `Complete the day's Skill Builders to a professional standard: ${tl.map(t=>t.title).join("; ")}.` : "Apply the day's learning in a live discussion."];
  out.discussionInfo = Object.assign({}, out.discussionInfo, {video:`Video Discussion — CM Day ${id}`});
  return out;
};
window.renderMeetClientTrainerGuide = function(){
  return `
    <div class="trainer-checkpoint">
      <div class="tc-tag">🧑‍🏫 Trainer Guide — Meet the Case</div>
      <p><b>Say:</b> "For the next five days you're the Case Manager on John Doe v. Apex Delivery Services. Let's open the file the way you would on day one."</p>
      <p><b>Do (5–8 minutes):</b> open the three “Start here” documents on this slide — the intake summary, the police report and the intake sheet — and walk the facts of loss: Valentine's Day, 2:35 PM, a commercial F-150 through a red light, extrication, facial laceration, lumbar injury, spouse in the passenger seat.</p>
      <p><b>Ask:</b> "What would you verify first, and where would you record it?" — then "Which of these facts would an adjuster attack?"</p>
      <p><b>Listen for:</b> checking the DOB and occupation against the source documents, the police report number, the unsigned HIPAA, the passenger as a possible second claimant (conflict check), and prior counsel.</p>
      <p><b>If quiet:</b> point at the DOB on the intake sheet and ask them to find it on a provider bill. The mismatch is deliberate — the documents contain errors they're expected to catch all week.</p>
      <p><b>Close:</b> "Everything you do this week happens on this file — read the 📂 Case File tonight and keep 📁 Case Documents open."</p>
    </div>`;
};

/* if the portal already drew itself before this file loaded, redraw with the updates */
if(document.querySelector(".topbar")) render();
