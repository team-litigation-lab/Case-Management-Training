// @check node — The Case Debrief's narration (build/debrief/debrief.json) is what its video says: each slide's notes are its captions in decks/debrief/debrief-narrated.vtt, word for word (punctuation, case and whitespace aside); the notes write each term as written (the "say" map voices it), run 90 to 230 words a slide, and every slide has its picture; the Litigation note on its slide is js/cm-litigation-note.js's, word for word, and said aloud
// The debrief is recorded from its notes (build/videoslide/make_video.py, as the day videos are: build/videoslide/README.md),
// so its captions are the notes as written; a note edited after the recording, and not recorded again, is a slide whose
// tab script says one thing while the voice says another. Each slide's cues are the ones that start between its time in
// `video.starts` and the next slide's. Until the video is recorded this check fails, on purpose: it says how to record it.
// Also checked, because the captions show the notes as written: no term is spelled out letter by letter in the notes
// ("P I P"): it is written as it is written (PIP) and the "say" map gives the voice its letters, as in every dayN.json;
// each slide's notes run 90 to 230 words (a minute or so of voice); every slide has decks/debrief/NN.webp
// (node build/debrief/render.cjs); a recorded video is under 25 MB, the most the site serves.
// Usage: node .github/scripts/debrief-narration.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const SPEC = 'build/debrief/debrief.json';
const failures = [];
// how to record it: build/videoslide/README.md, "The Case Debrief" (as the five days: Chatterbox Turbo, in the trainer's own voice)
const RECORD = 'as build/videoslide/README.md says under "The Case Debrief": node build/debrief/render.cjs, then make_video.py --turbo (the trainer\'s own voice, as the days) --web into build/debrief/out/video; copy debrief-narrated-web.mp4 to decks/debrief/debrief-narrated.mp4 and debrief-narrated.vtt beside it';
// the same reading of words as .github/scripts/narration-captions.cjs
const words = (t) => String(t || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[“”"]/g, ' ').replace(/[—–]/g, ' ')
  .replace(/[^a-z0-9$%&'+/.,:-]+/g, ' ').replace(/(^|\s)'|'(\s|$)/g, ' ').replace(/[.,:;!?]+(\s|$)/g, ' ').split(/\s+/).filter(Boolean);
const secs = (s) => { const m = /(?:(\d+):)?(\d+):(\d+)\.(\d+)/.exec(s); return m ? (+(m[1] || 0)) * 3600 + (+m[2]) * 60 + (+m[3]) + +('0.' + m[4]) : NaN; };

const spec = JSON.parse(fs.readFileSync(path.join(ROOT, SPEC), 'utf8'));
const slides = spec.slides || [], v = spec.video || {};
const say = spec.say || {}, keys = Object.keys(say).sort((x, y) => y.length - x.length);
const esc = (k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const spoken = (t) => keys.reduce((x, k) => x.replace(new RegExp(`(?<![\\w/])${esc(k)}(?![\\w/])`, 'g'), say[k]), String(t || ''));
if (!slides.length) failures.push(`${SPEC} has no slides`);

// the notes as the captions will show them
slides.forEach((s) => {
  const n = String(s.notes || '').trim().split(/\s+/).filter(Boolean).length;
  if (n < 90 || n > 230) failures.push(`${SPEC} slide ${s.page}: its notes run ${n} words (90 to 230: about a minute of voice)`);
  const spelled = String(s.notes || '').match(/\b(?:[A-Z] ){1,4}[A-Z0-9]\b/g);
  if (spelled) failures.push(`${SPEC} slide ${s.page}: "${spelled[0]}" is spelled out in the notes, which the captions show as written: write the term (${spelled[0].replace(/ /g, '')}) and give its letters in "say"`);
  const img = `decks/debrief/${String(s.page).padStart(2, '0')}.webp`;
  if (!fs.existsSync(path.join(ROOT, img))) failures.push(`${img} is missing: node build/debrief/render.cjs`);
});
// the Litigation note (Case Managers in Pre-Litigation and Litigation are sometimes different people; in Litigation, usually
// the paralegal): a slide carries it as "note", in the owner's words exactly as the site shows them (js/cm-litigation-note.js
// NOTE; changed there, it is copied here and the slide drawn again), and that slide's narration says it
const NOTE = (/const NOTE = "([^"]+)";/.exec(fs.readFileSync(path.join(ROOT, 'js/cm-litigation-note.js'), 'utf8')) || [])[1];
const noted = slides.filter((s) => s.note);
if (!noted.length) failures.push(`${SPEC}: no slide carries the Litigation note ("note": js/cm-litigation-note.js's NOTE, word for word)`);
noted.forEach((s) => {
  if (s.note !== NOTE) failures.push(`${SPEC} slide ${s.page}: its "note" is not js/cm-litigation-note.js's NOTE, word for word: copy it in, then node build/debrief/render.cjs`);
  if (!/litigation, the case manager is usually the paralegal/i.test(s.notes || '')) failures.push(`${SPEC} slide ${s.page}: it shows the Litigation note, but its narration doesn't say "in litigation, the case manager is usually the paralegal"`);
});
const allNotes = slides.map((s) => s.notes).join(' ');
['PIP', 'UM', 'BI', 'LOP', 'EMC', 'MRI', 'CMS', 'MedPay'].forEach((k) => { if (new RegExp(`\\b${k}\\b`).test(allNotes) && !say[k]) failures.push(`${SPEC}: "${k}" is in the notes but not in "say" (how the voice says it)`); });

// the recording: its captions, slide by slide
if (!v.captions || !v.src) failures.push(`${SPEC}: video.src and video.captions name the recording (/decks/debrief/debrief-narrated.mp4 and .vtt)`);
else {
  const vtt = path.join(ROOT, v.captions.replace(/^\//, '')), mp4 = path.join(ROOT, v.src.replace(/^\//, ''));
  const starts = v.starts || [];
  if (!fs.existsSync(vtt)) failures.push(`${v.captions} is missing: the Case Debrief is not recorded yet. Record it ${RECORD}; put the "video.starts" the last run prints in ${SPEC}, and run node build/videoslide/deck-slides.cjs`);
  else if (starts.length !== slides.length) failures.push(`${SPEC}: ${slides.length} slides but ${starts.length} start times in video.starts (make_video.py prints them)`);
  else {
    if (!fs.existsSync(mp4)) failures.push(`${v.src} is missing (its captions are there)`);
    else if (fs.statSync(mp4).size >= 25 * 1024 * 1024) failures.push(`${v.src} is ${(fs.statSync(mp4).size / 1048576).toFixed(1)} MB: the site serves 25 MB at most (make_video.py --web)`);
    const cues = fs.readFileSync(vtt, 'utf8').split(/\r?\n\r?\n/).map((b) => b.trim().split(/\r?\n/)).filter((l) => l.length > 1 && l[0].includes('-->'))
      .map((l) => ({ t: secs(l[0].split('-->')[0]), text: l.slice(1).join(' ') }));
    slides.forEach((s, i) => {
      const a = starts[i], b = i + 1 < starts.length ? starts[i + 1] : Infinity;
      const said = words(spoken(cues.filter((c) => c.t >= a - 0.05 && c.t < b - 0.05).map((c) => c.text).join(' '))), note = words(spoken(s.notes));
      if (said.join(' ') === note.join(' ')) return;
      let k = 0; while (k < said.length && said[k] === note[k]) k++;
      failures.push(`${SPEC} slide ${s.page}: the notes say "…${note.slice(Math.max(0, k - 3), k + 8).join(' ')}…" where the video says "…${said.slice(Math.max(0, k - 3), k + 8).join(' ')}…"`);
    });
  }
}
if (failures.length) { console.log(`✗ the Case Debrief's narration (${failures.length}):\n  ` + failures.join('\n  ')); process.exit(1); }
console.log(`The Case Debrief: all ${slides.length} slides' notes say, word for word, what its video's captions say; every slide has its picture.`);
