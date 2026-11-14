// @check node — Every narrated Canva deck page's notes (build/videoslide/dayN.json) say the words its narrated video says: the page's captions in decks/dayN/dayN-narrated.vtt, word for word (punctuation, case and whitespace aside)
// The video is recorded from the notes (build/videoslide/make_video.py): its captions are the notes as written (the
// "say" map changes only how the voice says a term, never the captions). A note edited after the recording, and not
// recorded again, is a page whose 🖥 Presenter script and captions say one thing while the voice says another (Day 2
// pages 23–24 once gave John Doe's figures in the notes while the video gave the deck's example). Each page's cues are
// the ones that start between its start time in `video.starts` and the next page's.
// Usage: node .github/scripts/narration-captions.cjs
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const failures = []; let pages = 0, days = 0;
const words = (t) => String(t || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[“”"]/g, ' ').replace(/[—–]/g, ' ')
  .replace(/[^a-z0-9$%&'+/.,:-]+/g, ' ').replace(/(^|\s)'|'(\s|$)/g, ' ').replace(/[.,:;!?]+(\s|$)/g, ' ').split(/\s+/).filter(Boolean);
const secs = (s) => { const m = /(?:(\d+):)?(\d+):(\d+)\.(\d+)/.exec(s); return m ? (+(m[1] || 0)) * 3600 + (+m[2]) * 60 + (+m[3]) + +('0.' + m[4]) : NaN; };
for (let n = 1; n <= 9; n++) {
  const f = path.join(ROOT, `build/videoslide/day${n}.json`); if (!fs.existsSync(f)) continue;
  const spec = JSON.parse(fs.readFileSync(f, 'utf8')), v = spec.video; if (!v || !v.captions) continue;
  const vtt = path.join(ROOT, v.captions.replace(/^\//, ''));
  if (!fs.existsSync(vtt)) { failures.push(`day${n}.json: its captions ${v.captions} are missing`); continue; }
  days++;
  const cues = fs.readFileSync(vtt, 'utf8').split(/\r?\n\r?\n/).map((b) => b.trim().split(/\r?\n/)).filter((l) => l.length > 1 && l[0].includes('-->'))
    .map((l) => ({t: secs(l[0].split('-->')[0]), text: l.slice(1).join(' ')}));
  const narrated = (spec.slides || []).filter((s) => s.notes && String(s.notes).trim());
  // the "say" map (PIP → "P I P") is how the voice says a term; captions normally keep the term as written, and either
  // way the two read the same once both are put through the map (make_video.py spoken())
  const say = spec.say || {}, keys = Object.keys(say).sort((x, y) => y.length - x.length);
  const esc = (k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const spoken = (t) => keys.reduce((x, k) => x.replace(new RegExp(`(?<![\\w/])${esc(k)}(?![\\w/])`, 'g'), say[k]), String(t || ''));
  if (narrated.length !== (v.starts || []).length) { failures.push(`day${n}.json: ${narrated.length} narrated pages but ${(v.starts || []).length} start times in video.starts`); continue; }
  narrated.forEach((s, i) => {
    pages++;
    const a = v.starts[i], b = i + 1 < v.starts.length ? v.starts[i + 1] : Infinity;
    const said = words(spoken(cues.filter((c) => c.t >= a - 0.05 && c.t < b - 0.05).map((c) => c.text).join(' '))), note = words(spoken(s.notes));
    if (said.join(' ') === note.join(' ')) return;
    let k = 0; while (k < said.length && said[k] === note[k]) k++;
    failures.push(`day${n}.json page ${s.page}: the notes say "…${note.slice(Math.max(0, k - 3), k + 8).join(' ')}…" where the video says "…${said.slice(Math.max(0, k - 3), k + 8).join(' ')}…"`);
  });
}
if (!days) failures.push('no day has a narrated video with captions: the files moved?');
if (failures.length) { console.log(`✗ narration vs captions (${failures.length}):\n  ` + failures.join('\n  ')); process.exit(1); }
console.log(`Narration: all ${pages} narrated deck pages on ${days} days have notes that say, word for word, what their video's captions say.`);
