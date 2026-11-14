// @check node — The trainer's notes for each day's agenda, Practice Lab and extra practice tell the daily loop as the schedule runs it: the required Backup File Maintenance, the side exercises' count and minutes, Day 5's build minutes
// build/case-flow/scripts/days.json (→ js/cm-case-flow-scripts.js, CM_CF_SCRIPTS._days, read by js/cm-day-loop.js in
// Presenter view) against the lesson data (CF.sequence `main` and `drive`, js/cm-case-flow-data.js) and the day's
// budget (js/cm-case-flow-schedule.js SIDE, LOOP and the build's minutes from build/case-flow/curriculum.cjs --check):
//   · every day's agenda note names 📁 Backup File Maintenance as required, before the Action Plan;
//   · the agenda and the Practice Lab notes count the day's side exercises (every activity that is neither the Skill
//     Building nor the Backup File Maintenance) right, and never call them optional;
//   · the Practice Lab notes give its minutes (SIDE.max, or SIDE.each a side exercise when fewer) and how many fit,
//     and no longer list the backup among the side exercises;
//   · Day 5 (a build day): the agenda, the build and the extra-practice notes give the build's minutes and the other
//     Skill Activities' count.
// Usage: node .github/scripts/loop-notes.cjs   (no server, no browser needed)
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
global.window = {};
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
const SCHED = require(path.join(ROOT, 'js/cm-case-flow-schedule.js'));
const CF = window.CM_CASE_FLOW, NOTES = JSON.parse(fs.readFileSync(path.join(ROOT, 'build/case-flow/scripts/days.json'), 'utf8'));
const KIND = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { KIND[b.id] = b.kind; })));
// the build's minutes, as the curriculum's own schedule prints them
const out = execFileSync(process.execPath, [path.join(ROOT, 'build/case-flow/curriculum.cjs'), '--check'], { cwd: ROOT, encoding: 'utf8' });
const buildMin = {}; out.split('\n').forEach(l => { const m = /^Day (\d+):.*companion-case build (\d+)/.exec(l); if (m) buildMin[m[1]] = Number(m[2]); });
// the Practice Lab's minutes, as the same schedule gives them (SIDE.max, more on a day whose lessons leave the Skill Building full)
const labMin = {}; out.split('\n').forEach(l => { const m = /^Day (\d+):.* in a (\d+)-minute Practice Lab/.exec(l); if (m) labMin[m[1]] = Number(m[2]); });
const failures = [], fail = m => failures.push(m);
const has = (s, n) => new RegExp(`(^|\\D)${n}(\\D|$)`).test(s);
CF.sequence.forEach(sd => {
  const n = sd.n, L = `Day ${n}`, N = NOTES[n] || {}, say = k => String((N[k] || {}).say || '');
  const sides = sd.phases.flatMap(p => p.blocks).filter(id => KIND[id] === 'activity' && id !== sd.main && id !== sd.drive).length;
  const ag = say('agenda');
  if (!sd.drive) fail(`${L}: CF.sequence names no required Backup File Maintenance (drive)`);
  const kB = ag.indexOf('Backup File Maintenance'), kP = ag.search(/Action Plan/);
  if (kB < 0 || !/Backup File Maintenance, required/.test(ag) || !(kB < kP)) fail(`${L}: the agenda note should name 📁 Backup File Maintenance as required, before the Action Plan: "${ag}"`);
  if (/optional/i.test(ag)) fail(`${L}: the agenda note calls the side exercises optional: "${ag}"`);
  if (!has(ag, sides)) fail(`${L}: the agenda note should count the day's ${sides} side exercises: "${ag}"`);
  if (sd.build) {
    const mins = buildMin[n];
    if (!mins) fail(`${L}: no build minutes in the curriculum's schedule`);
    else {
      if (!has(ag, mins) || /three hours/.test(ag)) fail(`${L}: the agenda note should give the build's ${mins} minutes: "${ag}"`);
      if (!has(say('build'), mins) || /three hours/.test(say('build'))) fail(`${L}: the build note should give its ${mins} minutes: "${say('build')}"`);
    }
    const ex = say('extra');
    if (!has(ex, sides) || /final backup audit, /.test(ex) || /^• Optional/.test(ex)) fail(`${L}: the extra-practice note should count the ${sides} other Skill Activities (the backup audit is the required step): "${ex}"`);
    return;
  }
  const lab = say('lab'), mins = labMin[n] || Math.min(SCHED.SIDE.max, SCHED.SIDE.each * sides), pick = Math.min(sides, Math.floor(mins / SCHED.SIDE.each));
  if (!has(lab, sides)) fail(`${L}: the Practice Lab note should count its ${sides} side exercises: "${lab}"`);
  if (!new RegExp(`About ${mins} minutes`).test(lab) || /About 30 minutes/.test(lab)) fail(`${L}: the Practice Lab note should say about ${mins} minutes (the schedule's Practice Lab): "${lab}"`);
  if (pick < sides && !new RegExp(`chooses ${pick}\\b`).test(lab)) fail(`${L}: the Practice Lab note should say each trainee chooses ${pick}: "${lab}"`);
  if (/^• Optional/.test(lab) || /(the backup folders|the backup audit|, the backup\b)/i.test(lab.split('\n')[1] || '')) fail(`${L}: the Practice Lab note should not call it optional nor list the backup among the side exercises: "${lab}"`);
});
if (failures.length) { console.log(`${failures.length} problem(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
console.log('The trainer\'s day notes tell the loop as scheduled: 📁 Backup File Maintenance required before the Action Plan every day, the side exercises counted right in a ' + SCHED.SIDE.max + '-minute Practice Lab, and Day 5\'s build in its own minutes.');
