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

**Lesson** (`kind: "lesson"`): drawn as Why it matters · The rules · See it (the block's existing `show` visual) ·
On the job · Do & Don't.
- `hook` — one sentence, **≤ 16 words**: the strategic why (from `tell.why`), as a confident headline.
- `points` — **3 or 4** rules, **≤ 12 words each**, from `tell.rules` (the most important ones; merge where
  natural). Imperative or declarative, no sub-clauses piled up.
- `upl` — the UPL boundary in **≤ 14 words**, if the block has `tell.upl` (else omit).
- `job` — from `ops`: **up to 3 rows**, each `[trigger, task, tool, checkpoint]`, **≤ 6 words per cell**.
- `dos` / `donts` — from `best` (practices → dos; "Pitfall: …" → donts): **2–3 each, ≤ 10 words each**.

**Activity** (`kind: "activity"`): drawn as Your case · Your task · The model (if `show`) · Check your work.
- `situation` — the scenario in **≤ 32 words**: file date, what just happened, what is at stake. Keep the key
  dates and figures the task needs; drop the rest.
- `steps` — the task (from `act.prompt`) as **3–5 imperative steps, ≤ 12 words each**, in order.
- `deliver` — the expected output (`act.output`) in **≤ 14 words**.
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
  Knowledge Check, Case Manager, Atty. Thorne, the CMS). Lines themselves are sentences: sentence case, ending
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
