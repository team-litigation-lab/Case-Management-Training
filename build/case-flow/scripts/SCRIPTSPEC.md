# Trainer scripts: what the trainer says on each Case Flow slide

Presenter view's "🎙 Script — read aloud" for every slide of every Case Flow block, and the day's
Trainer Speaker Notes PDF. One file per Case Flow day as taught (a block is in the day its Case Phase is taught on), `dN.json`, assembled into `js/cm-case-flow-scripts.js`
(`window.CM_CF_SCRIPTS`) by `node build/case-flow/scripts/assemble.cjs` (`--check` validates only,
in CI). A slide without a script here falls back to the script the course builds from the block.

## Shape

```json
{
  "d1m1-role": {
    "theory": { "say": "…", "ask": "…" },
    "rules":  { "say": "…" }
  }
}
```

Keyed by block id, then by slide (the block's views, in order: a lesson is map · theory · theory2 ·
frame · doc (when it introduces a document) · rules · model · dodont, and a lesson with no Theory slide opens with
why; an activity is task · case · grade · audit · model · check: **Your Task first, then Your Case**; a Learning Check
is questions · summary · scale; only the slides the block actually has). Every slide of every block has one.

The notes are shown beside the slide they are keyed to, so each is about THAT slide and can be read without the one
before it: a `task` note covers the steps (the scenario comes on the next slide, Your Case: say "on the next slide"
when it points there), a `case` note covers the scenario on the file and never introduces the task again. A day runs
ALL of its lessons first and then ONE Practice Lab with all of its Skill Activities, so a lesson's note never says
"the next activity" (its activity is in the lab, named there by "Practises: …"), and an activity's note never says
"the lesson we just did".

**Milestone Steps** is no slide: a `steps` script is refused. The 26 lessons that had the slide carry their steps in
the `rules` talking points (one or two points: the steps in order, with their dates), with the points that were on the
slide folded in beside them; where `rules` was at the limits below, the overflow sits on another slide of The Theory's
run (`theory`, `theory2`, `frame`; once on `map`, once on `model`, and on `why` in three brief lessons). Tighten wording
before dropping a fact.

**Why it matters** is the opening of The Theory, not a slide: a lesson with a Theory slide has no `why` script. Its
`theory` talking points start with the why (what the hook means on John Doe's file), then the theory, inside the limits
below; where the two together run over, tighten the wording, never drop a point that carries a fact. Where the slide's
opening line is the copy's shorter `whyLine`, the full hook is one of those points, word for word (the assembler checks).
The point about the lesson's CM Red Flag goes on the slide that draws it (`rules`, or `dodont` / `model` / `theory2`
where the copy's `redFlag.on` says so). A Red Flag that is **spoken, not drawn** (`redFlag.spoken`: no slide of the
lesson has room for it) is a point in `rules` that starts "Red flag" and carries what you see, what it costs and what
you do; the assembler refuses the build without it. Only a brief lesson still has a `why` slide and a `why` script
(why · doc · rules: it has no Theory slide).

## The day's own slides

`days.json` holds the scripts for the slides outside any block, by Case Flow day: `agenda` (the opening
Training Agenda: Part 1 the lessons, Part 2 the Practice Lab), `lab` (the one Practice Lab slide, after ALL of the
day's lessons and before its first Skill Activity) and `wrap` (the End-of-Day Discussion: shown beside the day's
last slide, 🎯 Ready for the Knowledge Check?; its say puts the day's discussion question to the room). A build day
(Day 5) has `build`, `build2` (the two Full Application Practice slides) and `extra` (Optional Extra Practice)
where the other days have the Practice Lab. Same voice and limits as a block's slides. A day without them keeps the
generic notes.

```json
{ "1": { "agenda": { "say": "…", "ask": "…" }, "lab": { "say": "…" }, "wrap": { "say": "…", "ask": "…" } } }
```

## Talking points (the standard now)

The trainer asked for simpler, straightforward notes that match how they actually teach: what to cover on the
slide, said in their own words, not a script to read out. A day rewritten this way (Day 1 first) has, on every
slide, a `say` of **talking points**:

- 2–6 lines (3–5 usually), each starting `• ` and on its own line (`\n` between them, nothing else in the string).
- Each point a short phrase or plain sentence, at most 25 words; at most 110 words in all. In the order the slide
  covers it.
- What to cover and explain, in plain language, with John Doe v. Robert Smith's real facts (names, dates, amounts
  exactly as on the file). A term that needs it gets its plain meaning in a few words ("PIP: the client's own
  no-fault medical coverage").
- No games, icebreakers, jokes, teasers, mysteries or war stories; no `{name}`; no "I/we" narration; no arrows or
  `**`.
- `ask` stays optional: one simple check question, ending in "?", only where it helps (a block's last slide, an
  activity's check); most slides have none. The End-of-Day Discussion keeps its question.

Presenter view, the Speaker Notes PDF and the Training Agenda show these as a bulleted list headed
"🗒 Talking points". `assemble.cjs` checks a talking-points `say` by the rules above, and any other `say` by the
read-aloud rules below, which the days not yet rewritten still follow.

## The voice (the read-aloud scripts, for days not yet rewritten as talking points)

A person talking to the room, not notes about it, built on the trainer's training DNA (below).

- **say**: what the trainer says out loud, 45–230 words. First person to the trainees: "I", "we",
  "you", contractions, plain spoken sentences. It covers what the slide covers (the why, the points,
  the steps), woven together the way you'd say them, with John Doe v. Robert Smith's real facts
  (names, dates, amounts exactly as on the file). Never a list, a label ("Tool:", "Output:",
  "Watch for this:"), an arrow (➔, →), `**`, or a stage direction ("Open with", "Point at",
  "Walk the", "Let the room", "Land it"): turn a direction into the words the trainer would say.
- **Short paragraphs, one beat each.** The say is broken into short paragraphs of one to three
  sentences, a blank line between them (`\n\n` in the JSON), so the trainer never loses their place
  reading aloud: the game, the answer, the run of it, the teaser, the joke each get their own. No
  paragraph runs past 60 words. Presenter view, Admin → Trainer Cues and the Speaker Notes PDF keep
  each paragraph apart. Day 1's
  Training Agenda is the model.
- **Sounds like a person.** Warm, natural and a little informal, the way a good trainer actually
  talks: contractions, mixed sentence lengths, the odd "okay", "honestly" or "here's the thing",
  a real reaction to the room ("I see you, {name}"). Never a template read off a card: say the
  lazy-vs-high-value contrast, the teaser and the war story in fresh words each time, not the same
  stock phrases slide after slide.
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

Where each fits best: a lesson's **why** (or the opening of its **theory**, where Why It Matters opens that slide) is the icebreaker and the teaser; **map**, **theory**,
**frame** and **model** tease and reveal in plain words; **rules** and **dodont** draw the lazy vs.
high-value line (and **rules** walks the milestones as they run on the job, with the settlement consequence). An
activity's **case**
teases and reveals what just landed; **task**, **grade** and **audit** put trainees on the spot by
name; **check** draws the lazy vs. high-value line. A Learning Check's **questions** play as a game
show. The last slide of every block closes on the mystery.
