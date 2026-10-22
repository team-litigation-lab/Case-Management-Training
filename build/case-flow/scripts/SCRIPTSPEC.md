# Trainer scripts: what the trainer says on each Case Flow slide

Presenter view's "🎙 Script — read aloud" for every slide of every Case Flow block, and the day's
Trainer Speaker Notes PDF. One file per Case Flow day as taught (a block is in the day its Case Phase is taught on), `dN.json`, assembled into `js/cm-case-flow-scripts.js`
(`window.CM_CF_SCRIPTS`) by `node build/case-flow/scripts/assemble.cjs` (`--check` validates only,
in CI). A slide without a script here falls back to the script the course builds from the block.

## Shape

```json
{
  "d1m1-role": {
    "why":   { "say": "…", "ask": "…" },
    "rules": { "say": "…" }
  }
}
```

Keyed by block id, then by slide (the block's views, in order: a lesson is why · doc (when it introduces a document) · theory · theory2 ·
frame · rules · model · job · dodont; an activity is case · task · model · check; a Learning Check is
questions · summary · scale; only the slides the block actually has). Every slide of every block has one.

## The voice

A person talking to the room, not notes about it.

- **say**: what the trainer says out loud, 45–150 words. First person to the trainees: "I", "we",
  "you", contractions, plain spoken sentences. It covers what the slide covers (the why, the points,
  the steps), woven together the way you'd say them, with John Doe v. Robert Smith's real facts
  (names, dates, amounts exactly as on the file). Never a list, a label ("Tool:", "Output:",
  "Watch for this:"), an arrow (➔, →), `**`, or a stage direction ("Open with", "Point at",
  "Walk the", "Let the room", "Land it"): turn a direction into the words the trainer would say.
- **ask** (optional): one question to the room, ending in "?", at most 30 words.
