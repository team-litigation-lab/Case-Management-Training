/* ============================================================
   The Case Flow day's 4-hour budget: one source for the slides' timers, the Training Agenda, the trainer's run of
   show and build/case-flow/curriculum.cjs (which fails a day that doesn't fit).
   The course is a REFRESHER: the trainees have met every topic before, so a day is 30% lesson and 70% practical.
     240 minutes = 20 (the welcome 5, a break 10, the close 5) + 220 teaching minutes:
       30% lessons   = 66 minutes, shared by the day's lessons in proportion to their slides (every lesson keeps all of its
                       slides and content: a refresher is taught faster, not thinner). The thorough lessons (mediation and
                       arbitration, `thorough` in the lesson data) count 1.5 times a slide.
       70% practical = 154 minutes: the Knowledge Check (10–15, longer the more topics), a brainstorm after every Skill
                       Building (5 minutes each, 30 at most, never under 3), and the Skill Activities, which share the rest
                       equally (5 to 30 minutes each). Whatever is left over is Q&A.
   A day is two parts, in this order: ALL of its lessons (`parts`: a run of lessons under one section heading), then ONE
   Practice Lab that holds all of its Skill Activities (`labs`: the lab's Skill Building groups, each the activities that
   practise one section's lessons, with a brainstorm after each group), then the Knowledge Check.
   A day with a build (Day 5's Full Application Practice: the trainees build their companion case) spends its practical on
   it: its own Skill Activities are optional extra practice, untimed. Day 5's lessons are condensed and capped at 30
   minutes (lessonMax), and the build takes every minute the lessons and the Knowledge Check leave (build: "rest").
   ============================================================ */
(function(root){
"use strict";
const DAY_MIN = 240, BREAK_MIN = 20, TEACH_MIN = DAY_MIN - BREAK_MIN, LESSON_SHARE = 0.30;
const LESSON_MIN = Math.round(TEACH_MIN * LESSON_SHARE);   // 66
const THOROUGH_WEIGHT = 1.5, LESSON_FLOOR = 2, BRIEF_MIN = 4;
const TOPIC = {base: 15, min: 2, max: 30}, ACT = {base: 10, min: 5, max: 30}, STORM = {each: 5, min: 3, day: 30};
/* split `total` whole minutes over weights, largest remainder first, each at least `floor` (when it can be) */
function share(total, weights, floor){
  const n = weights.length; if(!n) return [];
  const f = Math.min(floor, Math.floor(total / n)), rest = total - f * n, sum = weights.reduce((a, w) => a + w, 0) || 1;
  const raw = weights.map(w => rest * w / sum), out = raw.map(x => f + Math.floor(x));
  let left = total - out.reduce((a, x) => a + x, 0);
  raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if(left > 0){ out[i]++; left--; } });
  return out;
}
/* items: the day's lessons and Skill Activities in teaching order (no Learning Checks), each
   {kind: "lesson"|"activity", brief, thorough, slides, optional, heading, mod, modTitle, ref, id, of} — ref is handed back on
   the parts untouched; slides: the lesson's slide count (its views), 1 when not given; id: the block's id, and on an
   activity of: the id of the lesson it practises (its Skill Building group is that lesson's section).
   opts: {build: minutes} for a day whose practical is a build (Day 5's companion case). */
function schedule(items, opts){
  opts = opts || {};
  // build: minutes of practical spent on the build, or "rest" (whatever the lessons and the Knowledge Check leave)
  const fill = opts.build === "rest", lessonMax = Math.max(0, Number(opts.lessonMax) || LESSON_MIN);
  let build = fill ? 1 : Math.max(0, Number(opts.build) || 0);
  const timed = items.filter(x => !(x.kind === "activity" && (x.optional || build)));
  const lessons = timed.filter(x => x.kind === "lesson");
  const n = lessons.filter(x => !x.brief).length, m = lessons.filter(x => x.brief).length;
  const a = timed.filter(x => x.kind === "activity").length;
  const kc = Math.max(10, Math.min(15, Math.round(10 + (Math.max(n, 1) + m / 2 - 8) * 2.5)));
  // the lessons' parts: a run of lessons under one section heading (all of the day's lessons come before its Practice Lab)
  const parts = [], partOf = {}; let cur = null;
  const open = x => { cur = {heading: x.heading, mod: x.mod, modTitle: x.modTitle, topics: [], acts: [], extra: []}; parts.push(cur); };
  items.filter(x => x.kind === "lesson").forEach(x => {
    const h = x.heading || (cur ? cur.heading : "");   // a lesson with no heading of its own carries on the topic before it
    if(!cur || cur.heading !== h) open(Object.assign({}, x, {heading: h}));
    cur.topics.push(x); if(x.id) partOf[x.id] = cur;
  });
  const seen = {}; parts.forEach(p => { seen[p.heading] = (seen[p.heading] || 0) + 1; });
  // "Litigation" six times reads as nothing: a heading used more than once takes its module's name, up to its first "&" or ","
  const short = t => String(t || "").split(/\s+&\s+|,\s/)[0].trim();
  parts.forEach(p => { const mt = short(p.modTitle); p.title = seen[p.heading] > 1 && mt ? (mt.toLowerCase().includes(String(p.heading).toLowerCase()) ? mt : `${p.heading}: ${mt}`) : p.heading; });
  // … unless a run under that heading holds the lessons of several modules (all the lessons come together now, so a
  // run is no longer one module's), or two runs would get the same name: then they are numbered, "Litigation (1 of 2)"
  Object.keys(seen).filter(h => seen[h] > 1).forEach(h => { const same = parts.filter(p => p.heading === h);
    const mixed = same.some(p => new Set(p.topics.map(x => x.mod)).size > 1), names = new Set(same.map(p => p.title));
    if(mixed || names.size < same.length) same.forEach((p, i) => { p.title = `${h} (${i + 1} of ${same.length})`; }); });
  // the Practice Lab's Skill Building groups: the activities, in order, that practise one section's lessons
  const labs = []; let lab = null;
  items.filter(x => x.kind === "activity").forEach(x => {
    const part = (x.of && partOf[x.of]) || null, key = part || String(x.heading || "").replace(/^Skill Building:\s*/, "");
    if(!lab || lab.key !== key){ lab = {key, part, title: part ? part.title : key, acts: [], extra: []}; labs.push(lab); }
    (timed.includes(x) ? lab.acts : lab.extra).push(x);
  });
  const s = labs.filter(p => p.acts.length).length;
  const brainstorm = s ? Math.max(STORM.min, Math.min(STORM.each, Math.floor(STORM.day / s))) : 0;
  // 30% lessons (less when a build and the Knowledge Check leave less), 70% practical
  const lessonBudget = lessons.length ? Math.max(0, Math.min(LESSON_MIN, lessonMax, TEACH_MIN - kc - (fill ? 0 : build) - s * brainstorm - a * ACT.min)) : 0;
  if(fill) build = Math.max(0, TEACH_MIN - lessonBudget - kc - s * brainstorm);
  const weights = lessons.map(x => Math.max(1, Number(x.slides) || 1) * (x.thorough ? THOROUGH_WEIGHT : 1));
  const mins = share(lessonBudget, weights, LESSON_FLOOR);
  lessons.forEach((x, i) => { x.mins = mins[i]; });
  const practical = TEACH_MIN - lessonBudget;
  const room = practical - kc - s * brainstorm - build;
  const act = a ? Math.max(ACT.min, Math.min(ACT.max, Math.floor(room / a))) : 0;
  const per = n ? Math.round(lessons.filter(x => !x.brief).reduce((t, x) => t + x.mins, 0) / n) : 0;
  const briefMin = m ? Math.round(lessons.filter(x => x.brief).reduce((t, x) => t + x.mins, 0) / m) : BRIEF_MIN;
  parts.forEach(p => {
    p.full = p.topics.filter(x => !x.brief).length; p.briefs = p.topics.length - p.full;
    p.lecture = p.topics.reduce((t, x) => t + (x.mins || 0), 0); p.skill = 0; p.brainstorm = 0;
    p.mins = p.lecture;
  });
  labs.forEach(p => { delete p.key; p.skill = p.acts.length * act; p.brainstorm = p.acts.length ? brainstorm : 0; p.mins = p.skill + p.brainstorm; });
  const used = lessonBudget + a * act + s * brainstorm + kc + build;
  const total = BREAK_MIN + used;
  return {per, brief: briefMin, act, brainstorm, kc, build, parts, labs, labMin: a * act + s * brainstorm, room: TEACH_MIN, used, buffer: Math.max(0, TEACH_MIN - used), fits: total <= DAY_MIN,
    total, topics: n + m, full: n, briefs: m, acts: a, extras: items.filter(x => x.kind === "activity").length - a, skillParts: s,
    lessonMin: lessonBudget, practicalMin: TEACH_MIN - lessonBudget, lessonShare: Math.round(lessonBudget / TEACH_MIN * 100),
    DAY_MIN, BREAK_MIN, TEACH_MIN, LESSON_SHARE};
}
const api = {schedule, share, DAY_MIN, BREAK_MIN, TEACH_MIN, LESSON_SHARE, LESSON_MIN, THOROUGH_WEIGHT, BRIEF_MIN, TOPIC, ACT, STORM};
if(typeof module === "object" && module.exports) module.exports = api;
root.CM_CF_SCHEDULE = api;
})(typeof window !== "undefined" ? window : globalThis);
