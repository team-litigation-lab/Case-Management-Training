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

A person talking to the room, not notes about it, built on the trainer's training DNA (below).

- **say**: what the trainer says out loud, 45–230 words. First person to the trainees: "I", "we",
  "you", contractions, plain spoken sentences. It covers what the slide covers (the why, the points,
  the steps), woven together the way you'd say them, with John Doe v. Robert Smith's real facts
  (names, dates, amounts exactly as on the file). Never a list, a label ("Tool:", "Output:",
  "Watch for this:"), an arrow (➔, →), `**`, or a stage direction ("Open with", "Point at",
  "Walk the", "Let the room", "Land it"): turn a direction into the words the trainer would say.
- **ask** (optional): one question to the room, ending in "?", at most 35 words. Usually put to one
  trainee by name: "{name}, …?"
- **{name}**: where the trainer calls on a trainee. Presenter view and the Speaker Notes PDF fill in
  a first name from the batch being taught (a different one for each {name} on a slide), or
  [Trainee] until the roster loads. Write it exactly `{name}`; no other braces.

## The training DNA

Every block carries all of them; every slide carries the ones that fit it.

1. **Interactive icebreaker.** The block's first slide opens with a quick game (30–90 seconds): a
   show of hands, true or false, guess the number, would you rather, two truths and a lie, finish the
   sentence. Simple rules, said in one breath, to lower resistance and get hands up. Then the lesson.
2. **Plain language.** Short sentences an 8th grader follows. Any piece of jargon or process gets a
   one-breath plain explanation the first time it comes up on the slide ("a lien, which is just a
   bill that gets paid out of the settlement"). The trainer will supply fuller explanations: list
   the terms in `JARGON.md`.
3. **Direct engagement.** Call on trainees by name, `{name}`, at least once on every slide: to
   guess, to answer, to read the file, to argue a side. Questions are put to a person, not the air.
4. **Teaser and reveal.** Build a curiosity gap before the core lesson or a client detail lands:
   "Before I show you what's in that envelope, guess…", "There's one date on this file that can sink
   the whole case. I'll tell you which in a minute." Then pay it off on the same slide or the next.
5. **Elevated operational definition.** Contrast the lazy, bare-minimum version ("I left a
   voicemail") with high-value execution ("I called, texted, emailed, logged all three with times,
   and set the follow-up") so trainees see what excellent looks like, not just acceptable.
6. **Strategic outcome focus.** Tie today's small operational action to its real-world consequence
   down the line: the demand, the adjuster's offer, the lien reduction, the settlement number.
7. **Call to action / mystery.** The block's last slide ends on an investigative challenge or open
   mystery that the trainees solve on the file (or that the next block answers), so they leave as
   problem-solvers, not listeners.
8. **Storytelling and humor.** At least one war story per block: a funny, absurd or hyper-realistic
   composite from the field ("I once had a client who…", "a Case Manager I trained…"). Composites
   only: no real client, firm or carrier names, and never one that changes John Doe's facts. Keep the
   room laughing while the lesson lands.
9. **Jokes from the job.** Two or three short jokes per block, one or two sentences each, about the
   Case Manager's world or the real-life moments everyone in the room will recognize: the client
   whose "I'll send it tonight" means next Tuesday, the adjuster on a vacation that never ends, the
   fax machine that outlived three office managers, the voicemail box that's always full. Clean and
   workplace-safe: laugh with clients, never at their injuries, money troubles, or who they are; no
   real carriers, firms or people. Each joke still points at the lesson, and no premise repeats
   across blocks.

Where each fits best: a lesson's **why** is the icebreaker and the teaser; **map**, **theory**,
**frame** and **model** tease and reveal in plain words; **rules** and **dodont** draw the lazy vs.
high-value line; **job** tells the war story and the settlement consequence. An activity's **case**
teases and reveals what just landed; **task**, **grade** and **audit** put trainees on the spot by
name; **check** draws the lazy vs. high-value line. A Learning Check's **questions** play as a game
show. The last slide of every block closes on the mystery.
