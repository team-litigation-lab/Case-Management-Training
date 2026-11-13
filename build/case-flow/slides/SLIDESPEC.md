# Case Flow slides — concise copy spec

The Case Flow's slides show one idea per slide in big type. Each block (lesson, activity or Knowledge Check) is
drawn as a short run of slides from **concise copy** written here; the block's full curriculum text (in
`js/cm-case-flow-data.js`) stays one tap away ("📖 Full text") and in Presenter view. So the concise copy is a
faithful *distillation* of the block — never new content, never a new fact, never a contradiction.

Output: `build/case-flow/slides/dN.json` — an object keyed by block id (`d1m1-l1`, `d1m1-a1`, …, `d1m4-kc`), one entry
per block of the day (20 per day), in this shape:

```json
{
  "d1m1-l1": {
    "image": "insurance-stack",
    "hook": "Find every layer of coverage before you promise anyone a number.",
    "points": ["…", "…", "…"],
    "upl": "Explain the process; never predict the value of the claim.",
    "dos": ["…", "…", "…"],
    "donts": ["…", "…", "…"]
  },
  "d1m1-a1": {
    "image": "cms-screen",
    "situation": "…",
    "steps": ["…", "…", "…", "…"],
    "deliver": "…",
    "checks": ["…", "…", "…", "…"],
    "dos": ["…"], "donts": ["…"]
  },
  "d1m1-kc": {
    "image": "knowledge-check",
    "questions": ["…", "…", "…"]
  }
}
```

## Fields by block kind

**Lesson** (`kind: "lesson"`): drawn as The Theory (which opens with why it matters) · The rules · See it (the block's existing `show` visual) ·
Do & Don't. A lesson with no Theory slide (a `brief` one) is
Why it matters · The rules. (There is no On the job slide: the lesson's
`ops` in the data are drawn nowhere now, not on a slide and not in 📖 Additional Reference, and a `job`
field here is refused. There is no Milestone Steps slide either: see `milestones`, below.)
- `hook` — one sentence, **≤ 16 words**: the strategic why (from `tell.why`), as a confident headline. In a lesson that
  has The Theory it is no slide of its own: it opens that slide as a "💡 Why it matters" line above the theory's lead
  (one slide where there were two), so keep it to the one sentence (a `**Bold first sentence.** and more` hook is refused
  there: only the first sentence would be drawn); where it is too long for one line of the band, add a `whyLine`. A
  `brief` lesson has no Theory slide and keeps its Why It Matters slide: the hook beside its picture, the CM Red Flag
  and the case strip.
- `whyLine` (optional) — the opening line of The Theory where the hook would wrap onto a second line of the band: **one
  sentence, ≤ 14 words**, one highlight, saying why it matters (the hook's meaning, never a new fact). The full hook is
  then said on that slide: it must appear, word for word, in the lesson's `theory` talking points
  (`build/case-flow/scripts/assemble.cjs` refuses the build otherwise). Omit it where the hook fits on one line
  (about 85 characters on a laptop; `.github/scripts/micro-frameworks.cjs` fails a line that wraps).
- `whySlide` (optional) — `true` would keep Why It Matters as a slide of its own in a lesson that has The Theory. **No
  lesson uses it**: every one opens The Theory with the line at full size on a laptop (1366x768, no scaling, type ≥
  16px bold), and `.github/scripts/micro-frameworks.cjs` fails a lesson that keeps the slide.
- `points` — **3 or 4** rules, **≤ 12 words each**, from `tell.rules` (the most important ones; merge where
  natural). Imperative or declarative, no sub-clauses piled up.
- `upl` — the UPL boundary in **≤ 14 words**, if the block has `tell.upl` (else omit).
- `dos` / `donts` — from `best` (practices → dos; "Pitfall: …" → donts): **2–3 each, ≤ 10 words each**.

**The Document** (`document`, in the lesson's copy): **the New Document Instructional Standard.** Whenever a legal or
medical document enters the curriculum or the CMS workflow (a Causation Letter, a Letter of Protection, an
affidavit…), the lesson that introduces it carries a `document` breakdown, drawn as its own slide right after The
Theory's slides (after Why it matters in a brief lesson), and before any Skill Activity asks the trainee to request,
draft, audit or file that document.
```json
"document": {"name": "Causation Letter", "doc": "RS19", "definition": "…", "purpose": "…", "evidence": "…", "handling": ["…", "…", "…"]}
```
- `name` — the document's name, **≤ 6 words**, no highlight. `doc` — optional: the case document that is the file's
  own example (an `RS` id in `js/cm-case-flow-docs.js`), shown as its thumbnail.
- `definition` (what it is), `purpose` (its legal purpose), `evidence` (its key evidentiary role) — **≤ 24 words each**,
  one highlight.
- `handling` — **2–4** lines, **≤ 12 words** each, one highlight: how the Case Manager requests, checks, files and
  tracks it. Process only: what it means for the claim's value stays Atty. Thorne's.
- The slide needs its trainer script (`doc` in `build/case-flow/scripts/dN.json`).

**The Theory** (every lesson; in `build/case-flow/slides/theory-dN.json`, keyed by block id): drawn as the lesson's
first slide, opening with its 💡 Why it matters line. A lesson whose `roadmap` says `"merge": true` draws the roadmap
on this slide too: its steps down the left, the lead and the concept cards beside them (every line bold, ≥ 16px on a
laptop). It carries the decks'
*theory* — the definitions, frameworks, phases and principles behind the lesson — so the run of slides has the
context the decks gave, not only the rules. Take it from the deck pages that teach the lesson's topic (the text in
`js/cm-decks-data.js`, the page image in `decks/dayN/NN.webp`), and from the block's own text where no deck page does.
```json
"d1m4-l2": {
  "lead": "A case plan is a **living, approved document**: drafted in structure, reviewed by counsel, then run.",
  "concepts": [{"term": "Section templates", "text": "…"}, {"term": "…", "text": "…"}, {"term": "…", "text": "…"}],
  "pages": ["D1#24", "D1#25"]
}
```
- `lead` — the deck's definition or framing of the topic, **≤ 28 words**, one highlight.
- `concepts` — **3 or 4**: a `term` (**≤ 5 words**, no highlight: the deck's name for the idea) and its `text`
  (**≤ 20 words**, one highlight): what it is and why it matters. Complement The rules; don't repeat them.
  A deep topic (the coverages, the treatment phase: the Standard Treatment Map, MMI, red flags, gaps) may carry
  **6–8**, drawn as The theory and The theory, continued (four to a slide).
  A concept with more to it than its line may add `more`: **2–6** lines (**≤ 22 words** each, at most one highlight),
  shown in a pop-up card from the card's ＋ More button. Keep the card itself the one-line idea.
- `pages` — **1–2** original deck pages (`D1#24` = the Day 1 deck, page 24), the ones its theory comes from. These
  are the decks' page numbers, not the lesson's `sources` (which number the earlier course's topics); never a page
  that shows the archived Apex file's facts. `[]` only for a lesson with no deck behind it.
- The decks were written for the archived John Doe v. Apex file: take their *doctrine*, never Apex's names, dates
  or figures, and nothing that contradicts this course's block or `curriculum/5-day-flow/case-file.md`.
- `framework` (optional, but give one wherever the deck page carries a structure) — the deck page's own table,
  flowchart or checklist, **rebuilt as data** so the course draws it in its own design (the slides never show the
  deck's page images). Drawn as its own slide after The theory, titled by `title`.
  - `title` — the deck's name for it, **≤ 8 words**, no highlight ("The Standard Treatment Map").
  - `kind` — `"table"`: `head` (2–4 column headings, ≤ 4 words) and `rows` (2–6 rows of that many cells, ≤ 12 words
    each); or `"flow"` (a sequence, drawn with arrows) / `"list"` (cards): `steps`, 3–6 of `{label ≤ 5 words, text ≤ 16
    words}`. A step with more to it than its line may add `more` (2–6 lines, ≤ 22 words each, at most one highlight),
    opened from the step's ＋ More button as a pop-up card, the same as a concept's.
  - `note` (optional) — one line under it, **≤ 22 words**.
  - At most one highlight in any cell or step text; none is required. The same doctrine rule: never Apex's facts.

**Micro-frameworks** (optional, in the lesson's copy): the three components the revamp gives the lessons, drawn on the
lesson's existing slides, so no slide is added and no timing changes. Take every fact from the block and
`curriculum/5-day-flow/case-file.md`; at most one highlight in any line, none required.
- `redFlag` — the **CM Red Flag** (a red-bordered box with its flag icon and label; one per slide):
  `{"see": "…", "costs": "…", "do": "…", "owner": "Atty. Thorne"}` — `see` (what you notice) and `costs` (what it costs
  the file) **≤ 18 words**, `do` (an operational step, never a legal conclusion) **≤ 15 words**; `owner` is required:
  `Atty. Thorne` (the decision is counsel's) or `Case Manager`. It is drawn on Why It Matters where the lesson has that
  slide (a brief lesson). Where Why It Matters opens The Theory it is drawn on **The Rules**: under the points, or
  beside them in the picture's place when The Rules has a picture (no `ruleEx`); `"tight": true` draws four two-line
  points at the size they take beside Rule vs. Exception, so the flag fits beside them. Where The Rules has no room
  for it at full size on a laptop, `"on"` names the slide that has: `"dodont"` (under the Do & Don't), `"model"`
  (under See It), `"theory2"`, `"theory"`, `"frame"` or `"map"`; the slide must hold it without scaling and without
  the flag covering anything. Where no slide of the lesson has, `"spoken": true`: the Red Flag is **spoken, not
  drawn**. Its text then goes in the lesson's talking points for The Rules as a point that starts "Red flag" (the
  scripts assembler requires it), and `.github/scripts/micro-frameworks.cjs` lists the lesson with the measurements
  that forced it.
- `ruleEx` — **Rule vs. Exception**, drawn on The Rules in place of its picture: `{"rule": "…", "exception": "…",
  "onFile": "…", "confirm": "…"}` — `rule` and `exception` **≤ 25 words** (the exception a real carve-out or a
  jurisdictional contrast; `"contrast": true` labels it CONTRAST), `onFile` (optional) **≤ 20 words**, `confirm` **≤ 8
  words** naming Atty. Thorne or the governing statute.
- `milestones` — **Milestone Steps**, a numbered rail drawn on The Framework, or on The Rules of a lesson without
  one: `{"title": "…", "steps": [{"label": "…", "chip": "02/06/2028", "done": "…"}], "note": "…", "start": 4}` —
  `title` **≤ 8 words**, **3–6** steps in case order: `label` **≤ 4 words**, `chip` (optional) a date on the case file
  (MM/DD/YYYY) or a case document or claim id, `done` (the step's "Done when:") **≤ 12 words**; `note` (optional) **≤ 16
  words**; `start` numbers a rail that continues another (Steps 4–6). Give a lesson a rail only where that slide holds
  it at full size on a laptop (six lessons do). **There is no Milestone Steps slide** (`"slide": true` is refused): a
  lesson whose slides have no room for the rail carries no `milestones`, and its steps are in the trainer's talking
  points for The Rules (SCRIPTSPEC.md), as they are for the 26 lessons that once had the slide.
- `.github/scripts/micro-frameworks.cjs` checks that every lesson the revamp gives a framework draws it, with type ≥ 16px
  (a Red Flag listed as spoken, not drawn, is on no slide and in the talking points for The Rules), that no lesson has a
  Milestone Steps slide and a rail is drawn only on The Framework or The Rules, that no slide draws the On the Job cards (and no slide, 📖 Additional Reference
  panel or slide title of any day shows the word "Trigger"), that every lesson with a Theory slide opens it with why it matters on one line at full size (and has
  no Why It Matters slide), and that a Red Flag moved off Why It Matters sits on a slide that is not scaled down, with
  nothing beside it covered.

**Activity** (`kind: "activity"`): drawn as Your case · Your task · The model (if `show`) · Check your work.
- `situation` — the scenario in **≤ 32 words**: file date, what just happened, what is at stake. Keep the key
  dates and figures the task needs; drop the rest.
- `steps` — the task (from `act.prompt`) as **3–5 imperative steps, ≤ 12 words each**, in order.
- `deliver` — the expected output (`act.output`) in **≤ 14 words**.
- `purpose` (optional) — why the task matters to the file, in **≤ 14 words**; shown as 🎯 Purpose beside the steps.
- `principle` (optional) — the rule the task turns on, in **≤ 12 words**; shown as ⚖️ Principle (without it, the first
  `dos` item is shown). Each step ends with a link to where it is done (CMS → New Case, → Calendar, → Case Notes,
  📁 Documents, or the tool it names), drawn from the step's own words: name the place in the step.
- `checks` — **3–5** verification checkpoints (`act.checkpoints`), **≤ 10 words each**.
- `dos` / `donts` — **1–2 each** from `best`, ≤ 10 words.

**Knowledge Check** (`kind: "check"`): drawn as the questions, then the Self-Summary & Skill Scale (unchanged).
- `questions` — `check.questions`, each tightened to **≤ 18 words** (same question, same answer).

**Every block:** `image` — one key from the catalog below: the picture that best connects to *this* block's
lesson. Vary them: avoid the same image on consecutive blocks unless the topic is truly the same.

## Writing rules
- **Highlight the important point.** In every `hook`, `points` item, `situation`, `steps` item, `deliver`, `checks`
  item, `dos`/`donts` item and question, wrap the **one** most important phrase (2–5 words: the rule, the deadline,
  the figure, the action) in double asterisks: `"Verify **every limit in writing** before you rely on it."` Exactly one
  highlight per line (two only in a `situation`). The slide shows it as a highlighter mark, so pick what a trainee
  must remember.
- **Capitalize proper nouns and defined terms** as the course does (Host UM, Relative UM, Letter of Protection, Police Report,
  Knowledge Check, Case Manager, Atty. Thorne, the CMS). The defined terms are listed in `build/case-flow/terms.json` and
  written exactly so everywhere (Mediation Binder, Final Ledger, Net Sheet, Payer Order…); `node build/case-flow/terms.cjs`
  applies them and its `--check` (in Checks) fails on any other spelling. Lines themselves are sentences: sentence case, ending
  without a period unless they are full sentences of more than one clause.
- Plain, energetic, second person where natural ("you"). Short words. No jargon the block itself doesn't use.
- Numbers, dates, names, claim numbers exactly as in the block (and `curriculum/5-day-flow/case-file.md`).
- Keep every UPL boundary intact: the Case Manager never gives legal advice, values a claim, or decides strategy.
- No new facts, no new rules, no opinions the block doesn't hold. When in doubt, cut — the full text is a tap away.
- Never the word "blueprint". No emoji in the copy (the slides add their own icons).
- Respect the limits strictly (count words; a symbol on its own, like → · … &, is not a word); a slide in big type only fits short lines.

## Image catalog (`image` keys)
intake-interview · client-call · team-huddle · insurance-stack · coverage-check · policy-letter · cms-screen ·
data-entry · documents-audit · calendar-gap · clock-deadline · medical-visit · mri-scan · treatment-plan ·
car-transport · privacy-shield · phone-call · email-outreach · demand-letter · negotiation · money-ledger ·
lien-scale · release-signature · settlement-check · courthouse · legal-filing · mediation-table · arbitration ·
deposition-video · property-damage · repair-shop · skip-trace · escalation-alert · checklist-qa · bottleneck ·
binder-exhibits · knowledge-check · strategy-session
