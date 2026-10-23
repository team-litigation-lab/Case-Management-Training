# Exhibit audits, completed packages and the service confirmation — content spec

Three things a Case Manager does with a document set, which a Skill Activity's prose can describe but only a
worked artefact can teach:

1. **The audit.** An activity that assembles or serves a set gets the set itself — the draft Demand Package's
   exhibits, the draft Mediation Binder's sections, the unsorted arbitration folder — as a packet the trainee
   works item by item: keep it, replace it, pull it, add what is missing, or flag it for the attorney. Each item
   carries the loophole or evidentiary gap it hides and the documents that prove it.
2. **The completed package.** Once the audit is handed in, the finished, ready-to-go set is revealed: the
   Demand Package as served, the Mediation Binder as delivered, the Arbitration Binder as exchanged. The
   trainee compares their audit against it, and every later activity works from the same finished set, so the
   file carries one Demand Package and one binder through all five days.
3. **The service confirmation.** Demands go to the adjuster by email; no certified mail. The Case Manager
   writes the email that serves it, the adjuster acknowledges receipt in writing (the clock runs from that), and converting that
   exchange into a document filed in the CMS and backed up to Drive.

Output: `build/case-flow/exhibits/<part>.json` (`d3.json`, `d4.json`), assembled into
`js/cm-case-flow-exhibits.js` (`window.CM_CF_EXHIBITS`) by `node build/case-flow/exhibits/assemble.cjs`
(`--check` validates only, in CI). Facts come only from `curriculum/5-day-flow/case-file.md`, the block
(`js/cm-case-flow-data.js`) and the document set (`js/cm-case-flow-docs.js`, `build/case-flow/documents/SPEC.md`).
A finding here never contradicts a document's trainer key; it is the same plant, stated as the work.

```json
{
  "audits": {
    "d3m1-a1": {
      "title": "…", "kicker": "…", "source": "RS61", "reveal": "RS62", "due": "07/20/2026",
      "intro": "…",
      "columns": {"ref": "Exhibit", "as": "As drafted"},
      "items": [
        { "ref": "A", "what": "…", "as": "…", "verdict": "replace", "kind": "loophole",
          "issue": "…", "fix": "…", "proof": ["RS07"] }
      ],
      "revealNote": "…",
      "revealPoints": ["…"]
    }
  },
  "emails": { "d3m1-a1": { … } }
}
```

## audits — one per Skill Activity that works a document set

- `title` — what the panel is called, ≤ 9 words, naming the set.
- `kicker` — the job in one line, ≤ 16 words, imperative.
- `source` — the document id of the draft set the trainee audits. It must be in that activity's
  `CM_CF_DOC_PACKETS` packet, so the trainee can open it beside the panel.
- `reveal` — the document id of the completed set, shown only once the audit is handed in. It must **not** be in
  the activity's packet: it is the answer.
- `due` — the case date by which the audited set must be out, `MM/DD/YYYY`.
- `intro` — ≤ 55 words: where the file stands, and what the audit is for.
- `columns.ref` / `columns.as` — the two column headings the set needs ("Exhibit"/"As drafted",
  "Section"/"As drafted", "Record"/"As it came out of the file").
- `items` — 12–18 per audit, in the set's own order:
  - `ref` — the item's place in the set (`"A"`, `"§5"`, `"#13"`), or `"—"` for something missing.
  - `what` — the document or figure, ≤ 14 words.
  - `as` — how the draft has it, ≤ 26 words. For a missing item, what the set does not have.
  - `verdict` — one of `keep` · `replace` · `pull` · `add` · `flag`. `flag` means it stays, and the decision
    is the attorney's: it is the UPL boundary as a verdict.
  - `kind` — `loophole` (the other side could use it) · `gap` (the record does not prove what it must) ·
    `privilege` (ours, and not theirs to see) · `qc` (the copy is not fit to use) · `arithmetic` (a figure that
    does not tie) · `calendar` (a date counted from the wrong event).
  - `issue` — ≤ 44 words: what it would cost, concretely, naming the party who would use it. A `keep` item's
    `issue` says what makes the copy fit to use.
  - `fix` — ≤ 36 words: the task, and who does it. A `keep` item's `fix` is what to confirm before service.
  - `proof` — 1–4 document ids from `js/cm-case-flow-docs.js` that settle the point. Each must open on or
    before the day the activity is taught.
- `revealNote` — ≤ 45 words: what the completed set is, and that later activities work from it.
- `revealPoints` — 4–6 lines, ≤ 24 words each: the figures and terms the finished set carries, so a trainee can
  mark their own audit against it.

Every audit needs at least three `keep` items (a trainee who marks everything wrong has not audited anything),
at least one `flag`, and at least one `add`.

## emails — the service confirmation

One per activity that serves something. The trainee writes the email, the other side answers, and the exchange
becomes a filed document.

```json
"d3m1-a1": {
  "title": "…", "kicker": "…", "model": "RS63",
  "sent": "07/20/2026",
  "to": "…", "cc": "…", "subject": "…", "attachment": "…",
  "brief": "…",
  "required": [{"id": "receipt-date", "label": "…", "hint": "…", "match": ["regex", …]}],
  "reply": {"from": "…", "date": "…", "time": "…", "subject": "…", "body": "…"},
  "press": {"from": "…", "date": "…", "subject": "…", "body": "…",
            "choices": [{"label": "…", "ok": false, "why": "…"}]},
  "convert": {"title": "…", "category": "Others", "type": "Others", "folder": "insurance",
              "sections": [{"h": "…", "lines": ["…"]}], "establishes": ["…"]}
}
```
- `brief` — ≤ 50 words: what the email must do, in the Case Manager's own terms, with the UPL line.
- `required` — 4–6 elements the email must contain. Each `match` pattern is tested case-insensitively against
  what the trainee wrote; every pattern must match a correct email and none of them a wrong one. `hint` is
  shown only after a failed send, ≤ 20 words.
- `reply` — the acknowledgment, in the other party's voice, ≤ 130 words, written so it fixes the date and the
  completeness of the set from their own words. No emoji, no HTML.
- `press` — the follow-up the other side sends next, with 2–4 `choices`: exactly one is `ok`. This is the UPL
  test; `why` says what each choice would cost, ≤ 30 words.
- `convert` — the memorandum the trainee files: its `sections` are the headings and the lines under each, and
  `establishes` is what the acknowledgment proves. `category` is the CMS Doc Hub category, `type` the type
  part of the firm's file name, and `folder` the `CM_CF_DOC_FOLDERS` id of the Backup Drive folder the
  firm keeps this kind of document in — the filing keeps a copy there, as it does for a case document.
  `model` is the document id of the finished memorandum.

## amendments — records wrong at their source (the pre-demand audit's Amendment Requests)

One per activity that screens the file for records a provider must correct. A Case Manager never fixes a provider's
record or statement: the request goes with Atty. Thorne's approval, the provider corrects its own record (a medical
record only by a dated addendum, the original kept), and the corrected copy is filed beside the original.

```json
"d2m4-a1": {
  "title": "…", "kicker": "…", "intro": "…",
  "screen": [{"doc": "RS14", "why": "…"}, {"doc": "RS16"}],
  "requests": [{
    "doc": "RS16", "corrected": "RS72", "proof": ["RS12"],
    "wrong": "…", "to": "…", "cc": "…", "subject": "…", "attachment": "…", "brief": "…",
    "required": [{"id": "…", "label": "…", "hint": "…", "match": ["regex", …]}],
    "forbidden": [{"id": "…", "label": "…", "why": "…", "match": ["regex", …]}],
    "reply": {"from": "…", "date": "…", "time": "…", "subject": "…", "body": "…"},
    "next": {"q": "…", "choices": [{"label": "…", "ok": false, "why": "…"}]},
    "protects": "…", "model": "…"
  }]
}
```
- `screen` — 6–14 documents from the activity's packet, the trainee calls each "fit to use" or "wrong at its source".
  A document that needs a request carries no `why` (its feedback is the request's `wrong`); every other one has a
  `why` ≤ 30 words saying what makes it sound. At least three are fit to use.
- `requests` — 1–4, one per document wrong at its source (each must carry `PLANTED` in its manifest key):
  - `corrected` — the document id of the corrected copy the answer brings, or `null` when the provider does not
    correct it (then `next` is required: the decision that leaves, 2–4 `choices`, exactly one `ok`). A corrected copy
    carries `amends` (this document) and `unlock` (this activity) in the manifest, is not in the activity's packet,
    and opens to a trainee only once their request is sent.
  - `wrong` ≤ 40 words; `brief` ≤ 55; `protects` ≤ 45 (what the correction protects in the demand).
  - `required` — 4–6 elements, tested like the service confirmation's; one of them routes the request through
    Atty. Thorne. `hint` ≤ 24 words. `forbidden` — what a request must never do (ask for clinical findings to change,
    concede a debt, share the case's value); any match refuses the email with its `why` ≤ 40 words.
  - `reply` ≤ 130 words, in the provider's voice. `model` ≤ 170 words: the firm's own request. It must pass every
    `required` element and trip no `forbidden` one — the assembler checks, so a pattern that would refuse a correct
    email fails the build — and the trainee reads theirs against it in the feedback.
- Every figure, date and name follows the same rule as the audits: found in the case file, the lesson data, the
  manifest or the documents the request draws on (`doc`, `corrected`, `proof`).

## The audits follow the lessons and the practice case

Nothing here is a fact of its own. Every figure, date and name in an audit or a confirmation is a restatement
of something the course already says, so the assembler requires each one to be found in a source that item
actually draws on:

- `curriculum/5-day-flow/case-file.md` — the practice case
- `js/cm-case-flow-data.js` — the lessons
- `js/cm-case-flow-docs.js` — the document manifest, titles, descriptions and trainer keys
- the text of the documents that item works from: the audit's `source` and `reveal`, and every id in the
  item's own `proof`

A figure or date in an item that is in none of them fails the build, naming the item and the documents it
draws on. So a change to a lesson or to the practice case that leaves an audit behind is a red check with the
item named, instead of an audit that teaches a number the file no longer carries.

Names are checked the same way, because a carrier or coverage the course has stopped calling by that name
reads worst of all to a trainee. A name is satisfied if the phrase is in the sources, or the phrase without
its first word is (so a step beginning "Request the Final Itemized Ledger" is not a finding), or every
capitalised word in it appears somewhere in them.

**What this cannot do:** it checks an audit against the sources, not the sources against each other. While the
course itself says two different things — a coverage renamed in the documents but not in the lessons — an
audit that follows either one passes. Keeping the sources consistent is the document audit's job
(`build/case-flow/documents/audit.cjs`) and `terms.cjs`'s.

## Rules
- Plain, realistic voices; an adjuster sounds like an adjuster. No emoji, no HTML, no "blueprint".
- Every UPL boundary holds: the Case Manager audits, assembles, asks and files; the attorney decides terms,
  privilege, extensions and what is exchanged.
- Every date `MM/DD/YYYY`, every figure as `case-file.md` has it, every document id real, every word limit kept.

## Notes & Action Plan (`notes`)

One per activity whose Your Case slide is a message to work (the voicemail on `d1m3-a1`): it takes the place of
the document thumbnails beside it. The trainee transcribes the message (graded against `transcribe.facts`, then the
transcript, `spoken` from the sim event, and the facts are shown as the answer key), writes an action plan (graded
against `plan.required`; each step's `key` is its answer key, shown once the plan is handed in), then works the plan:
the `emails` in the Email Simulator (refused while one leaves out a `required` element or matches a `forbid`
pattern, answered with `reply` once it doesn't) and the `call` (the activity's live call in `build/case-flow/sim`).

```json
"d1m3-a1": {
  "title": "…", "kicker": "…",
  "transcribe": {"brief": "…", "facts": [{"label": "…", "match": ["regex", …]}]},
  "plan": {"brief": "…", "required": [{"id": "…", "label": "…", "hint": "…", "match": ["regex"], "key": "…"}]},
  "emails": [{"id": "…", "title": "…", "why": "…", "to": "…", "cc": "…", "subject": "…", "brief": "…",
              "required": [{"id": "…", "label": "…", "hint": "…", "match": ["regex"]}],
              "forbid": [{"match": "regex", "why": "…"}],
              "reply": {"from": "…", "date": "MM/DD/YYYY", "time": "…", "subject": "…", "body": "…"}}],
  "call": {"title": "…", "why": "…", "goals": ["…"]}
}
```
Every `match` pattern must match a correct answer and none of the wrong ones; `forbid` catches what must not be
said (an injury detail to the adverse carrier). The record (`REC.notes`) goes to the trainer with the module's
Learning Check.
