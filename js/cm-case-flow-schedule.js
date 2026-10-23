/* ============================================================
   The Case Flow day's 4-hour budget: one source for the slides' timers, the Training Agenda, the trainer's run of
   show and build/case-flow/curriculum.cjs (which fails a day that doesn't fit).
   A day runs topic by topic: a topic's lessons, then its Skill Building (that topic's Skill Activities on John Doe's
   file), then a short brainstorm on what the file just taught, then the next topic; the Knowledge Check closes it.
     240 minutes = 20 (the welcome 5, a break 10, the close 5) + the Knowledge Check (10–15, longer the more topics)
                 + a brainstorm after every Skill Building (5 minutes each, 30 at most in a day, never under 3)
                 + every full topic (8–20 minutes) + every condensed overview (4) + every Skill Activity (5–15).
   The topics and the activities share what is left in proportion (15 : 10 to start), rounded down to whole minutes
   until the day fits, then grown again a minute at a time while it still fits. Whatever is left over is Q&A.
   ============================================================ */
(function(root){
"use strict";
const DAY_MIN = 240, BREAK_MIN = 20, BRIEF_MIN = 4;
const TOPIC = {base: 15, min: 8, max: 20}, ACT = {base: 10, min: 5, max: 15}, STORM = {each: 5, min: 3, day: 30};
const clamp = (v, r) => Math.max(r.min, Math.min(r.max, v));
/* items: the day's lessons and Skill Activities in teaching order (no Learning Checks), each
   {kind: "lesson"|"activity", brief, heading, mod, modTitle, ref} — ref is handed back on the parts untouched. */
function schedule(items){
  const n = items.filter(x => x.kind === "lesson" && !x.brief).length, m = items.filter(x => x.kind === "lesson" && x.brief).length;
  const a = items.filter(x => x.kind === "activity").length;
  const kc = Math.max(10, Math.min(15, Math.round(10 + (Math.max(n, 1) + m / 2 - 8) * 2.5)));
  // the parts: a run of lessons under one heading, and the Skill Activities that follow it
  const parts = []; let cur = null;
  const open = x => { cur = {heading: x.heading, mod: x.mod, modTitle: x.modTitle, topics: [], acts: []}; parts.push(cur); };
  items.forEach(x => {
    if(x.kind === "lesson"){
      const h = x.heading || (cur && !cur.acts.length ? cur.heading : "");   // a lesson with no heading of its own carries on the topic before it
      if(!cur || cur.acts.length || cur.heading !== h) open(Object.assign({}, x, {heading: h})); cur.topics.push(x);
    }
    else if(x.kind === "activity"){ if(!cur) open(Object.assign({}, x, {heading: String(x.heading || "").replace(/^Skill Building:\s*/, "")})); cur.acts.push(x); }
  });
  const seen = {}; parts.forEach(p => { seen[p.heading] = (seen[p.heading] || 0) + 1; });
  // "Litigation" six times reads as nothing: a heading used more than once takes its module's name, up to its first "&" or ","
  const short = t => String(t || "").split(/\s+&\s+|,\s/)[0].trim();
  parts.forEach(p => { const m = short(p.modTitle); p.title = seen[p.heading] > 1 && m ? (m.toLowerCase().includes(String(p.heading).toLowerCase()) ? m : `${p.heading}: ${m}`) : p.heading; });
  const s = parts.filter(p => p.acts.length).length;
  const brainstorm = s ? Math.max(STORM.min, Math.min(STORM.each, Math.floor(STORM.day / s))) : 0;
  const room = DAY_MIN - BREAK_MIN - kc - s * brainstorm;
  const need = (t, ac) => n * t + m * BRIEF_MIN + a * ac;
  const f = (room - m * BRIEF_MIN) / Math.max(1, n * TOPIC.base + a * ACT.base);
  let per = clamp(Math.floor(TOPIC.base * f), TOPIC), act = clamp(Math.floor(ACT.base * f), ACT);
  while(need(per, act) > room && (act > ACT.min || per > TOPIC.min)){
    if(act > ACT.min && (per <= TOPIC.min || act * TOPIC.base >= per * ACT.base)) act--; else per--;
  }
  for(let grew = true; grew;){
    grew = false;
    if(per < TOPIC.max && need(per + 1, act) <= room){ per++; grew = true; }
    if(act < ACT.max && need(per, act + 1) <= room){ act++; grew = true; }
  }
  parts.forEach(p => {
    p.full = p.topics.filter(x => !x.brief).length; p.briefs = p.topics.length - p.full;
    p.lecture = p.full * per + p.briefs * BRIEF_MIN; p.skill = p.acts.length * act; p.brainstorm = p.acts.length ? brainstorm : 0;
    p.mins = p.lecture + p.skill + p.brainstorm;
  });
  const used = need(per, act);
  return {per, brief: BRIEF_MIN, act, brainstorm, kc, parts, room, used, buffer: Math.max(0, room - used), fits: used <= room,
    total: BREAK_MIN + kc + s * brainstorm + used, topics: n + m, full: n, briefs: m, acts: a, skillParts: s, DAY_MIN, BREAK_MIN};
}
const api = {schedule, DAY_MIN, BREAK_MIN, BRIEF_MIN, TOPIC, ACT, STORM};
if(typeof module === "object" && module.exports) module.exports = api;
root.CM_CF_SCHEDULE = api;
})(typeof window !== "undefined" ? window : globalThis);
