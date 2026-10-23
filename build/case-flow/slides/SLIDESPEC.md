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
    "job": [["Trigger", "Task", "Tool", "Checkpoint"], ["…", "…", "…", "…"]],
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

**Lesson** (`kind: "lesson"`): drawn as Why it matters · The theory · The rules · See it (the block's existing `show` visual) ·
On the job · Do & Don't.
- `hook` — one sentence, **≤ 16 words**: the strategic why (from `tell.why`), as a confident headline.
- `points` — **3 or 4** rules, **≤ 12 words each**, from `tell.rules` (the most important ones; merge where
  natural). Imperative or declarative, no sub-clauses piled up.
- `upl` — the UPL boundary in **≤ 14 words**, if the block has `tell.upl` (else omit).
- `job` — from `ops`: **up to 3 rows**, each `[trigger, task, tool, checkpoint]`, **≤ 6 words per cell**.
- `dos` / `donts` — from `best` (practices → dos; "Pitfall: …" → donts): **2–3 each, ≤ 10 words each**.

**The Document** (`document`, in the lesson's copy): **the New Document Instructional Standard.** Whenever a legal or
medical document enters the curriculum or the CMS workflow (a Causation Letter, a Letter of Protection, an
affidavit…), the lesson that introduces it carries a `document` breakdown, drawn as its own slide right after Why it
matters, and before any Skill Activity asks the trainee to request, draft, audit or file that document.
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

**The Theory** (every lesson; in `build/case-flow/slides/theory-dN.json`, keyed by block id): drawn as its own slide
after Why it matters, beside thumbnails of the original Canva deck pages it comes from. It carries the decks'
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
