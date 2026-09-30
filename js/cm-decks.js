/* ================= The lessons are the decks' own pages =================
   Each day's slides are its "Revised Case Management Training Day N" deck, one slide per page, rendered from
   Canva's PDF by build/decks.py (decks/dayN/NN.webp, js/cm-decks-data.js). Each topic is a run of pages that
   follows the deck's own sections, and opens with its divider; the deck's title and agenda open the day and
   its Thank You page closes it. Everything around the pages stays: the Task Overview, Meet the Case, the
   Quick Checks (after the topic that now covers them), the Video Recap, the Skill Builders and the Knowledge
   Check.

   The topics written for the course before (d.oldLessons) are matched to the pages that cover them (the words
   they share), so each page's Presenter view, trainer cue and read-aloud script are the ones written for that
   content. Saved places ("resume here" and "furthest reached") and Quick Check answers move to the same
   content, once (marked inside the saved objects, so a copy restored from the cloud is moved too).
   Topics added later in the Content Studio (no pages) keep their own two slides. */
(function(){
  const DK = window.CM_DECKS;
  if(!DK || typeof DAYS === "undefined") return;
  let off = false;   // while true, the functions below behave as before (the old layout, for moving saved places)

  // ---------- which pages cover each topic written before ----------
  const STOP = new Set(("the and for are you your with that this from not but all can will has have into what when where who how its it's " +
    "their them they our was were been being than then out any each also more most such case cases manager managers client clients " +
    "phase phases must should use make sure one two three").split(" "));
  const words = (s)=> String(s||"").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").split(" ").filter(w=>w.length > 2 && !STOP.has(w));
  const strings = (x, out)=>{ out = out || [];
    if(typeof x === "string") out.push(x);
    else if(Array.isArray(x)) x.forEach(y=>strings(y, out));
    else if(x && typeof x === "object") Object.values(x).forEach(y=>strings(y, out));
    return out; };
  function pageScorer(D){
    const nums = Object.keys(D.pages).map(Number), df = {}, vecs = {};
    nums.forEach(n=>{ const tf = {}; words(D.pages[n].t + " " + D.pages[n].w).forEach(w=>{ tf[w] = (tf[w]||0) + 1; }); vecs[n] = tf; Object.keys(tf).forEach(w=>{ df[w] = (df[w]||0) + 1; }); });
    const idf = w => Math.log((nums.length + 1) / ((df[w]||0) + 1));
    const norm = {}; nums.forEach(n=>{ norm[n] = Math.sqrt(Object.entries(vecs[n]).reduce((s,[w,c])=>s + (c*idf(w))**2, 0)) || 1; });
    return (text, among)=>{
      const q = {}; words(text).forEach(w=>{ q[w] = (q[w]||0) + 1; });
      const qn = Math.sqrt(Object.entries(q).reduce((s,[w,c])=>s + (c*idf(w))**2, 0)) || 1;
      return (among || nums).map(n=>{ let s = 0; for(const w in q) if(vecs[n][w]) s += q[w]*vecs[n][w]*idf(w)**2; return {n, s: s/(qn*norm[n])}; }).sort((a,b)=>b.s - a.s);
    };
  }
  const partText = (l, part)=>{
    const fp = l.fourPart || {};
    return part === 1
      ? [l.h, fp.corePrinciples, fp.howTo, l.processSteps, l.boxes, l.quadrants, l.compareLeft, l.compareRight, l.tableHeaders, l.tableRows, l.trainerCue].map(x=>strings(x).join(" ")).join(" ")
      : [l.h, fp.bestPractices, fp.discussionCase, l.callout].map(x=>strings(x).join(" ")).join(" ");
  };

  // ---------- each day: its topics become the deck's pages ----------
  DAYS.forEach(d=>{
    const D = DK[d.id]; if(!D || d.cmDeck) return;
    const topicOf = {}; D.topics.forEach((t,i)=>t.pages.forEach(n=>{ topicOf[n] = i; }));
    const score = pageScorer(D), inLessons = Object.keys(topicOf).map(Number);
    d.oldLessons = d.lessons; d.oldQuickChecks = d.quickChecks || [];
    // every topic written before, and each of its two slides, goes with the page that covers it best
    const byPage = {}, pageOf = {};
    d.oldLessons.forEach((l,i)=>{
      const all = score(partText(l,1) + " " + partText(l,2), inLessons), top = all[0];
      const near = all.filter(x=>x.s >= top.s*0.6).map(x=>x.n);
      pageOf[i] = {};
      [1,2].forEach(part=>{
        const best = (part === 2 && l.singleSlide) ? top : (score(partText(l, part), near)[0] || top);
        pageOf[i][part] = best.n;
        (byPage[best.n] = byPage[best.n] || []).push({lesson: l, index: i, part, s: best.s});
      });
    });
    Object.values(byPage).forEach(a=>a.sort((x,y)=>y.s - x.s));
    d.cmDeck = {D, byPage, pageOf, topicOf};
    d.lessons = D.topics.map(t=>{
      const titles = []; t.pages.forEach(n=>{ const x = D.pages[n].t; if(x && !titles.includes(x) && !/^Day \d$/.test(x)) titles.push(x); });
      return {h: t.h, section: t.section, pages: t.pages.slice(), singleSlide: t.pages.length === 1, b: titles, fourPart: {}, trainerCue: ""};
    });
    // a Quick Check follows the topic that now covers the one it came after
    d.quickChecks = d.oldQuickChecks.map(q=>{
      const p = pageOf[q.afterIndex] ? (pageOf[q.afterIndex][2] || pageOf[q.afterIndex][1]) : null;
      return Object.assign({}, q, {afterIndex: p != null && topicOf[p] != null ? topicOf[p] : d.lessons.length - 1});
    });
  });

  const deckOf = d => (!off && d && d.cmDeck) ? d.cmDeck : null;
  const pageSrc = (d, n) => `/decks/day${d.id}/${String(n).padStart(2,"0")}.webp`;
  const pageNum = (d, slide) => slide.type === "deckPage" ? slide.page
    : (slide.type === "topic" && d.lessons[slide.lessonIndex] && d.lessons[slide.lessonIndex].pages) ? d.lessons[slide.lessonIndex].pages[slide.part-1] : null;
  window.cmDeckPage = pageNum;
  window.cmDeckPageSrc = pageSrc;
  window.cmDeckSetOff = v => { off = !!v; };

  const __build = buildDaySlides;
  buildDaySlides = function(d){
    const k = deckOf(d); if(!k) return __build(d);
    const s = [];
    k.D.open.forEach(n=>s.push({type:"deckPage", page:n}));
    if(d.taskOverview) s.push({type:"taskOverview"});
    if(d.id === 1) s.push({type:"meetClient"});
    d.lessons.forEach((l,i)=>{
      if(!d.noDividers) s.push({type:"divider", lessonIndex:i});
      if(l.pages) l.pages.forEach((n,j)=>s.push({type:"topic", lessonIndex:i, part:j+1}));
      else { s.push({type:"topic", lessonIndex:i, part:1}); if(!l.singleSlide) s.push({type:"topic", lessonIndex:i, part:2}); }
      if((d.quickChecks||[]).some(q=>q.afterIndex === i)) s.push({type:"quickCheck", lessonIndex:i});
    });
    if(d.recapVideo) s.push({type:"video"});
    if(relatedTools(d.id).length) s.push({type:"practiceLab"});
    if(d.discussionQuestion && trainerInline()) s.push({type:"discussion"});
    k.D.close.forEach(n=>s.push({type:"deckPage", page:n}));
    return s;
  };

  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){
    const k = deckOf(d);
    if(k && slide && slide.type === "deckPage"){
      if(k.D.close.includes(slide.page)) return "Thank You";
      return slide.page === k.D.open[0] ? `Day ${d.id}: ${d.title}` : "Training Agenda";
    }
    if(k && slide && slide.type === "topic"){
      const l = d.lessons[slide.lessonIndex];
      if(l && l.pages) return l.h + (l.pages.length > 1 ? ` (page ${slide.part} of ${l.pages.length})` : "");
    }
    return __title(d, slide);
  };

  function renderPage(d, n){
    const p = deckOf(d).D.pages[n] || {};
    return `<div class="cm-deck-page" data-page="${n}">
      <img src="${pageSrc(d, n)}" width="${deckOf(d).D.w}" height="${deckOf(d).D.h}" alt="${esc(p.t || "")}" decoding="async">
      <div class="cm-deck-words">${esc(p.w || "")}</div>
    </div>`;
  }
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide, idx){
    const n = deckOf(d) ? pageNum(d, slide) : null;
    if(n != null){
      // the next page is fetched ahead, so Next shows it straight away
      const nx = buildDaySlides(d)[idx+1], m = nx ? pageNum(d, nx) : null;
      if(m != null){ const im = new Image(); im.src = pageSrc(d, m); }
      return renderPage(d, n);
    }
    return __content(d, slide, idx);
  };

  // ---------- trainer notes and scripts: the ones written for what's on the page ----------
  const entryFor = (d, l, part)=>{
    const k = deckOf(d); if(!k || !l || !l.pages) return null;
    const n = l.pages[(part||1)-1], list = k.byPage[n] || [];
    return {n, page: k.D.pages[n] || {}, main: list[0] || null, also: list.slice(1)};
  };
  const pageSummary = p => String(p.w || "").split(/(?<=[.!?])\s+/).slice(0, 3).join(" ").slice(0, 320);
  const __note = presenterNote;
  presenterNote = function(d, l, part){
    const e = entryFor(d, l, part);
    if(!e) return __note(d, l, part);
    if(e.main) return __note(d, e.main.lesson, e.main.part);
    return {cue: "", say: `On this page: ${e.page.t || l.h}. ${pageSummary(e.page)}`, ask: "Which point on this page matters most in your own files?", wrap: "", scenario: ""};
  };
  if(typeof slideScript === "function"){
    const __script = slideScript;
    slideScript = function(d, l, part){
      const e = entryFor(d, l, part);
      if(!e) return __script(d, l, part);
      if(e.main) return __script(d, e.main.lesson, e.main.part);
      return {why: `On this page: ${e.page.t || l.h}.`, talk: pageSummary(e.page), walk: [], ask: "Which point on this page matters most in your own files?", scenario: "", hand: false};
    };
  }
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    const k = deckOf(d);
    if(k && slide && slide.type === "deckPage"){
      const p = k.D.pages[slide.page] || {};
      if(k.D.close.includes(slide.page)) return `<h3>Thank You</h3><p>Close Day ${d.id}: thank the room, name the one habit to take into tomorrow, then open the Knowledge Check.</p>`;
      return slide.page === k.D.open[0]
        ? `<h3>Day ${d.id}: ${esc(d.title)}</h3><p>Welcome the room and set the day: ${esc(d.theme || "")}.</p>`
        : `<h3>Training Agenda</h3><p>Walk through today's agenda: ${esc(pageSummary(p))}</p>`;
    }
    const e = slide && slide.type === "topic" ? entryFor(d, d.lessons[slide.lessonIndex], slide.part) : null;
    if(!e) return __cues(d, slide);
    const l = d.lessons[slide.lessonIndex];
    const head = `<h3>${esc(l.h)}${l.pages.length > 1 ? ` <small style="font-size:12px;color:var(--ink-soft);">Page ${slide.part} of ${l.pages.length}</small>` : ""}</h3>`;
    const on = `<div class="pn-on"><b>On this page</b><p>${esc(e.page.t || "")}${e.page.t ? " — " : ""}${esc(pageSummary(e.page))}</p></div>`;
    if(!e.main) return head + on + `<div class="pn"><div class="script-block"><div class="script-head"><span>🎙 Script — read aloud</span></div><p class="script-say">Give the room a moment to read this page, then ask which point matters most in their own files.</p></div></div>`;
    const also = e.also.filter(x=>x.lesson !== e.main.lesson).map(x=>x.lesson.h).filter((h,i,a)=>a.indexOf(h) === i);
    // both halves of a topic written for this page (its principles and steps, then its practices): both scripts
    const parts = [e.main, ...e.also].filter(x=>x.lesson === e.main.lesson).map(x=>x.part).sort();
    return head + on + parts.map(p=>renderPresenterNote(d, e.main.lesson, p)).join("") +
      (also.length ? `<p class="pv-also"><b>Also on this page:</b> ${also.map(esc).join(" · ")}</p>` : "");
  };

  // ---------- saved places and Quick Check answers move to the same content, once ----------
  function moveSaved(){
    if(!state.lastSlide && !state.slideProgress) return false;
    const ls = state.lastSlide = state.lastSlide || {}, sp = state.slideProgress = state.slideProgress || {};
    if(ls._cmDecks) return false;
    let qaMoved = false;
    DAYS.forEach(d=>{
      const k = d.cmDeck; if(!k) return;
      off = true;
      const oldD = Object.assign({}, d, {lessons: d.oldLessons, quickChecks: d.oldQuickChecks});
      const oldSlides = buildDaySlides(oldD);
      off = false;
      const newSlides = buildDaySlides(d);
      const find = pred => newSlides.findIndex(pred);
      const pageSlide = n => find(x=>pageNum(d, x) === n);
      const moveOne = i=>{
        for(let j=i; j>=0; j--){   // this slide, or the nearest one before it that has a place in the new layout
          const x = oldSlides[j]; if(!x) continue;
          if(x.type === "topic" || x.type === "divider"){ const p = k.pageOf[x.lessonIndex] && k.pageOf[x.lessonIndex][x.type === "topic" ? x.part : 1]; const idx = p != null ? pageSlide(p) : -1; if(idx >= 0) return idx; }
          else if(x.type === "quickCheck"){ const q = d.quickChecks.find((q,qi)=>d.oldQuickChecks[qi].afterIndex === x.lessonIndex); const idx = q ? find(y=>y.type === "quickCheck" && y.lessonIndex === q.afterIndex) : -1; if(idx >= 0) return idx; }
          else { const idx = find(y=>y.type === x.type); if(idx >= 0) return idx; }
        }
        return 0;
      };
      if(typeof ls[d.id] === "number" && ls[d.id] > 0) ls[d.id] = moveOne(ls[d.id]);
      if(typeof sp[d.id] === "number" && sp[d.id] > 0) sp[d.id] = moveOne(sp[d.id]);
      if(typeof ls[d.id] === "number" && (sp[d.id]||0) < ls[d.id]) sp[d.id] = ls[d.id];
      // Quick Check answers are keyed "<day>_<topic position>_<n>"
      const qa = state.qcAnswers || {};
      {
        const oldKey = qi=>{ const q = d.oldQuickChecks[qi]; return `${d.id}_${q.afterIndex}_${d.oldQuickChecks.slice(0, qi).filter(x=>x.afterIndex === q.afterIndex).length}`; };
        const newKey = qi=>{ const q = d.quickChecks[qi]; return `${d.id}_${q.afterIndex}_${d.quickChecks.slice(0, qi).filter(x=>x.afterIndex === q.afterIndex).length}`; };
        const moved = {};
        d.oldQuickChecks.forEach((q,qi)=>{ const a = oldKey(qi); if(qa[a] !== undefined){ moved[newKey(qi)] = qa[a]; delete qa[a]; } });
        if(Object.keys(moved).length){ Object.assign(qa, moved); state.qcAnswers = qa; qaMoved = true; }
      }
    });
    ls._cmDecks = true; sp._cmDecks = true;   // (the mark travels with the saved places, e.g. into the cloud copy)
    return {qaMoved};
  }
  async function moveSavedAndStore(){
    const r = moveSaved(); if(!r) return;
    await storeSet("last-slide", state.lastSlide);
    await storeSet("slide-progress", state.slideProgress);
    if(r.qaMoved) await storeSet("quick-check-answers", state.qcAnswers);
  }
  // The course's own move (topics regrouped, dividers added) works on the topics written before, then this one runs.
  const __migrate = migrateDayOrder;
  migrateDayOrder = async function(){
    DAYS.forEach(d=>{ if(d.cmDeck){ d.__deckLessons = d.lessons; d.__deckQC = d.quickChecks; d.lessons = d.oldLessons; d.quickChecks = d.oldQuickChecks; } });
    off = true;
    try{ await __migrate(); }
    finally{
      off = false;
      DAYS.forEach(d=>{ if(d.cmDeck){ d.lessons = d.__deckLessons; d.quickChecks = d.__deckQC; delete d.__deckLessons; delete d.__deckQC; } });
    }
    await moveSavedAndStore();
  };
  // (the saved places may already be loaded by the time this file runs)
  if(state.dayOrderMigrated !== undefined && state.dividersMigrated !== undefined) moveSavedAndStore();

  // ---------- look: the page fills the slide frame ----------
  const st = document.createElement("style"); st.id = "cm-decks"; st.textContent = `
.lesson-stage #lessonSlideWrap:has(> .cm-deck-page){padding:10px 12px;}
#lessonSlideWrap > .cm-deck-page{flex:1 1 auto;min-height:0;height:100%;width:100%;max-width:none;display:flex;align-items:center;justify-content:center;}
.cm-deck-page img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 14px 34px -20px rgba(22,24,41,.55);background:#262B45;}
.cm-deck-words{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;}
.pv-also{font-size:13px;color:var(--ink-soft);margin-top:10px;}
@media(max-width:760px){ .lesson-stage #lessonSlideWrap:has(> .cm-deck-page){padding:6px;} #lessonSlideWrap > .cm-deck-page{height:auto;} .cm-deck-page img{max-height:none;width:100%;} }
`; document.head.appendChild(st);
})();
