# Case Flow simulation — content spec

The Case Flow is a realistic simulation of a Case Manager's participation on one file, *John Doe v. Robert
Smith*. Each Skill Activity is something that **happens on the file**: it arrives (an email, a call, a letter,
a CMS alert), on a real date of the case, and the trainee works it in the CMS. Each Case Phase has **a live call**
with the right party, and what the trainee does (or skips) **comes back later** on the file.

Facts come only from `curriculum/5-day-flow/case-file.md` and the block itself (`js/cm-case-flow-data.js`):
names, dates, amounts, claim numbers, adjusters, providers. Never invent a fact that contradicts them; when you
need a small connective detail (a time of day, an email subject), keep it plausible and consistent.

Output: `build/case-flow/sim/<part>.json` (`days12.json`, `days345.json`), one object:

```json
{
  "events": { "<activity id>": { … } },
  "calls":  { "<activity id>": { … } },
  "fallout": [ { … } ],
  "timeline": [ { … } ]          // only in days12.json: the whole case's milestones
}
```

## events — one per Skill Activity (every activity of your days)

What lands on the file and starts the activity: the realistic trigger, as the trainee would see it arrive.

```json
"d1m1-open": {
  "date": "02/09/2026", "time": "8:42 a.m.",
  "channel": "email",                 // email · call · voicemail · letter · fax · alert · portal · text · memo
  "from": "On the Records Intake <intake@ontherecords.example>",
  "to": "Case Manager",
  "subject": "New matter: John Doe — MVA 02/06/2026 (passenger)",
  "body": "…",                        // ≤ 60 words, in the sender's voice; the ask, the deadline, the attachments
  "attachments": ["RS01", "RS02"]     // optional: document ids from js/cm-case-flow-docs.js that this message carries
}
```
- **A voicemail is heard, not read** (`"channel": "voicemail"`). Give it `spoken`: what the caller says, word for word
  as they'd say it (fillers, pauses as "...", numbers in words, ≤ 160 words), and `listen`: 3–6 questions that test
  what a Case Manager must catch by ear (`{"q": "…", "a": "the answer, ≤ 30 words", "match": ["regex", …]}`, every
  pattern must match a trainee's correct note, case-insensitive). The course plays it like a voicemail box and keeps
  the transcript hidden until the trainee checks their notes. `from` is the caller ID, which may not be the number
  to call back.
- **What happened just before** (`"before": [ {event}, … ]`, optional): events from the same morning or days that
  set it up (a client calling back, a letter going out), each a full event (date, channel, from, subject, body ≤ 60
  words) dated on or before the activity's event. The slide shows them above the event, smaller.
- **A log snapshot** (`"log": {"title", "head": [2–5 columns], "rows": [{"cells": […], "mark"?: "call"|"email"|"esc"}], "note"?}`,
  optional): a CMS log as it stands when the event lands (the Communications Log of the No Contact Protocol, say),
  2–10 rows, ≤ 14 words a cell, a "Date" first column in MM/DD/YYYY. The slide shows it in place of the document
  thumbnails; the activity's documents stay under Your Task's Work From.
- The date must match the activity's own scenario date where it gives one, and sit in the right place on the
  case timeline. A CMS-generated trigger is `"channel": "alert", "from": "CMS"`.
- Atty. Thorne's internal asks are `"channel": "memo"` or `"email"` from `Atty. Elijah Thorne`.
- Email addresses use `.example` domains (the firm: `@lshlawgroup.example`; Atty. Thorne is `ethorne@lshlawgroup.example`).

## calls — one per Case Phase (at least), on the activity named for that phase below

A live, voiced roleplay call the trainee takes inside the course. Write it so an AI can play the other party
convincingly and the trainee has a real job to do.

```json
"d1m3-a1": {
  "who": "John Doe",                  // the person on the line
  "role": "client",                   // client · family · adjuster · provider · attorney · counsel · paralegal · lienholder · mediator
  "persona": "Polite but anxious; …", // ≤ 30 words: temperament, what they want, what they'll push on
  "context": "…",                     // ≤ 90 words, for the AI: the date, the facts on the file, what this caller knows and wants, how they react
  "opening": "…",                     // the caller's first line, verbatim, in character, ≤ 40 words
  "goals": ["…", "…", "…"],           // 3–4: what the Case Manager must achieve on the call (≤ 14 words each)
  "line": "…"                         // the UPL line on this call, ≤ 20 words
}
```
Calls for **Days 1–2** (in `days12.json`):
| Case Phase | Activity | On the line |
|---|---|---|
| D1 · Intake & Property Damage | `d1m3-a1` | John Doe — onboarding call; he mentions Robert Smith's carrier already called him |
| D1 · Claim Set Up | `d2m1-a2` | Dana Whitfield, Keystone Mutual BI (limits, Dec Page, authorizations) |
| D2 · Client Communications | `d1m2-a1` | Margaret Doe, John's mother and emergency contact, while John is unreachable |
| D2 · Treatment (provider endorsement) | `d2m2-a1` | Tammy Greer, Riverton Spine & Rehab's office manager — the LOP endorsement call before the 02/24/2026 evaluation |
| D2 · Treatment | `d2m2-a2` | John Doe — resurfacing after the near-drop: the trauma-informed re-engagement interview (A-C-T) |
| D2 · Treatment (second) | `d2m3-a1` | John Doe — the recorded gap interview |
| D2 · Pre-Demand Case Auditing | `d2m4-a2` | Atty. Elijah Thorne — the pre-demand strategy session |

Calls for **Days 3–5** (in `days345.json`):
| Case Phase | Activity | On the line |
|---|---|---|
| D3 · Demand | `d3m1-a1` | Dana Whitfield — the first call after the time-limit demand is served |
| D3 · Settlement Negotiations | `d3m2-a1` | Dana Whitfield — MRI findings vs. the 14-day gap |
| D3 · Lien Negotiations & Reduction | `d3m3-a2` | Riverton Spine & Rehab's billing manager — the LOP balance |
| D3 · Disbursement & Closing a Case | `d3m4-a2` | John Doe — "why is my check this amount?" at disbursement |
| D4 · The Litigation Fork | `d4m1-a1` | Atty. Elijah Thorne — briefing the impasse and the filing criteria |
| D4 · Mediation, Arbitration & the Calendar | `d4m2-a1` | Defense counsel's paralegal — an extension "no need to put it in writing" |
| D4 · Mediation & Arbitration Binders | `d4m3-a2` | A provider's records department — certified records stuck before the binder deadline |
| D4 · Common Bottlenecks | `d4m4-a2` | Dana Whitfield, non-responsive, finally calls back |
| D5 · Litigation | `d5m1-a1` | Defense counsel's office — discovery responses and the deadline |
| D5 · Property Damage in Litigation | `d5m2-a2` | The PD adjuster (Leah Moran) — diminished value |
| D5 · Deposition Preparation | `d5m3-a1` | John Doe — deposition prep |
| D5 · Deposition Preparation (second) | `d5m3-a2` | Defense counsel Atty. Grant Mercer — mock cross |
| D5 · Liability Disputes & Skip-Tracing | `d5m4-a2` | Margaret Doe — John has gone quiet before his deposition |
| D5 · Dropped Cases & Withdrawal Letters | `d5m6-a1` | Denise Harlow (a practice matter, not the Doe file) — “was my case worthless?” after her Withdrawal Letter |

Use the names the data already uses (adjusters, counsel, providers); if the block names a different person for
that role, use the block's.

## fallout — what the trainee skipped comes back later (4–8 rules per part)

The trainee ticks each "Check Your Work" item on an activity's last slide. A rule says: if item *n* of activity
*A* was **not** ticked, then when the trainee reaches later activity *B*, the file shows a fallout event.

```json
{ "if": {"activity": "d1m1-open", "check": 1},     // index into that activity's slide-copy "checks" (build/case-flow/slides/dN.json)
  "then": {"activity": "d2m1-a1",                    // a LATER activity in the course order (js/cm-case-flow-data.js `sequence`)
           "event": {"channel": "alert", "from": "CMS", "subject": "…", "body": "… ≤ 45 words: the realistic consequence, and what it costs now"}}}
```
- Pick consequences a real file would show: an undocketed deadline surfacing as a calendar audit flag, an
  unflagged lien appearing at disbursement, a client contact not logged becoming a gap the adjuster cites, a
  Dec Page never requested stalling the demand.
- The later activity must come after the first in the sequence, and the consequence must make sense there.

## timeline — the case's milestones (`days12.json` only, the whole case)

```json
{ "date": "02/06/2026", "label": "Collision · date of loss", "track": "", "lane": "" }   // track: "" (both), "A" or "B"; lane: "" (shared), "claims" or "care"
```
The case runs on two parallel workstreams: `claims` (Claims & Coverage: claims, LORs, coverage, Dec Pages) and
`care` (Client & Treatment: client contact, treatment, LOPs, the gap). Shared milestones (the collision, intake,
the demand and after) carry `"lane": ""`.
15–34 milestones from `case-file.md`, in date order, labels ≤ 6 words: the collision, intake, claims opened,
LORs, first treatment, LOPs, the MRI, the disruption, MMI, the Causation Letter, the demand, settlement (Track A),
the fork, suit filed, discovery, mediation, deposition, the SOL. Track A and Track B milestones carry their track.

## Rules
- Plain, realistic voices: an adjuster sounds like an adjuster, John Doe like a warehouse shift lead in pain.
- No emoji, no HTML, no "blueprint". Keep every UPL boundary: the Case Manager never values, advises or decides strategy.
- Every id must exist; every date `MM/DD/YYYY`; every word limit respected.
