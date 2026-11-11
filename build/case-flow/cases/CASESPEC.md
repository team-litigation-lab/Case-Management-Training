# Companion cases: a second file for each trainee

Ten short personal-injury files beside John Doe v. Robert Smith. The course still teaches on John Doe's
file; a trainer assigns each trainee one companion case (Admin → Trainee Audit → 📁 Case), and every Case
Flow day the trainee meets a new problem on it that matches that day's lessons. Each day ends with an
**Attorney–CM brainstorm**: the trainer plays Atty. Elijah Thorne, the trainee presents how they'd handle
it, and the trainer works from the talking points and answer key here.

`cases.json` holds them; `node build/case-flow/cases/assemble.cjs` writes `js/cm-companion-cases.js`
(`window.CM_COMPANION_CASES`), and `--check` validates (CI).

## Shape

```json
{
  "c01": {
    "title": "Maria Alvarez v. Dale Pruitt",
    "theme": "Conflict of interest",
    "hook": "One sentence the trainee reads first: what makes this file different.",
    "type": "Motor vehicle: rear-end collision at a stoplight",
    "client": "Who the client is, in one or two sentences (age, work, family, how they came to the firm).",
    "facts": ["3–6 facts at intake, one sentence each"],
    "coverage": "Who insures whom, with limits, in one or two sentences.",
    "injuries": "The injuries and the treatment so far, in one or two sentences.",
    "days": {
      "1": {
        "title": "Short name for today's problem",
        "situation": "What happens on the file today (2–4 sentences).",
        "task": "What the Case Manager must do or prepare before the brainstorm (1–2 sentences).",
        "attorneyAsks": ["2–3 questions the trainer, as Atty. Thorne, puts to the trainee"],
        "strongAnswer": ["3–5 points a high-value answer covers: the trainer's answer key"],
        "attorneysCall": "The decision that belongs to the attorney, not the Case Manager (the UPL line).",
        "watchFor": "The mistake a new Case Manager makes here (one sentence)."
      },
      "2": {}, "3": {}, "4": {}, "5": {}
    }
  }
}
```

## Rules

- **Ten cases, `c01`–`c10`, each with all five days.** Each case has one main problem (its `theme`) that
  runs through the week, and each day's situation also fits that day's lessons:
  1. Day 1, Intake, Claims & Property Damage: the Conflict Check, opening the matter, client contact,
     the do's and don'ts, Property Damage and the rental.
  2. Day 2, Claim Set Up & Treatment: coverage verification, letters of representation, the Case Plan,
     keeping the client in care, LOPs, the health plan's right to be paid back, gaps in treatment.
  3. Day 3, Pre-Demand Audit, the Demand & Settlement Negotiation: auditing records and bills, the
     Specials, the demand, adjuster tactics, the negotiation, the Net Sheet.
  4. Day 4, Reductions, Lien Negotiation & ADR: lien and balance reductions, the release, disbursement,
     the litigation fork, mediation and arbitration, binders, calendars.
  5. Day 5, Litigation & Dropped Cases: filing and service, discovery, depositions, comparative fault, a
     client who disappears, the award, closing or dropping the file.
- **The Case Manager's lane.** Every day names what the Case Manager does (facts, documents, logging,
  routing, deadlines, client contact) and what is Atty. Thorne's call (advice, value, strategy, settlement
  authority, conflicts waivers, withdrawing). Never have the Case Manager give legal advice.
- **Fictional and self-contained.** Lead counsel is Atty. Elijah Thorne for every case. Invent every
  other name, carrier and provider; none from John Doe's file (see `curriculum/5-day-flow/case-file.md`),
  and no real carriers, firms or people.
- **No calendar years.** Dates are relative ("eleven days after the crash", "the Friday before
  mediation"), so the file never goes stale. No `20xx` anywhere. Dollar amounts are fine.
- **Plain, specific, teachable.** Short sentences an 8th grader follows; concrete numbers and names; the
  `strongAnswer` points are things a trainer can check off as the trainee talks.
