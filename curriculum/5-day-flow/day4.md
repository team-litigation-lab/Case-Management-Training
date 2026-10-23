# Case Flow Day 4 — Reductions, Lien Negotiation & ADR

**Phase:** Reductions, lien negotiation & ADR · **Focus case:** John Doe v. Robert Smith · **Lead Counsel:** Atty. Elijah Thorne

**Objective.** With Track A settled at $40,000 gross (Day 3), audit the Limited Release; reduce the liens and the provider balances and disburse a reconciled $20,359.92 net to John Doe; then, where the file does not settle (Track B), run the alternative dispute resolution side: the mediation and arbitration rules and hard dates, the UPL line at hearings, and the mediation and arbitration binders.

**Gate to the next day.** Track A: liens resolved at $1,240.00 and $4,580.00, Net Sheet and Trust Ledger reconciled to $0.00, closing memo filed · ADR: hard-rule calendar set for the mediation and the arbitration, ADR rules matrix complete, Mediation Binder and arbitration exhibits assembled

**The file as this day opens.**

- Track A: the file settles. BI Time-Limited Demand served 07/20/2026; Keystone offers $3,500 on 08/05 and tenders the $10,000 limits on 08/12.
- Liens to resolve: Peach State $1,860.00 paid; Riverton Spine & Rehab $6,290.00 billed under its LOP.
- Track B: the same file, back at 08/05/2026. Keystone holds at $3,500 and lets the Time-Limited Demand lapse on 08/21/2026; the file goes to suit (Day 5 follows the litigation itself), to mediation (03/18/2027) and to UM arbitration (06/22/2027).

> Generated from `js/cm-case-flow-data.js` by `build/case-flow/curriculum.cjs`. Edit the data and regenerate; never edit this file by hand. Spec: `00-architecture.md`. Theory map: `traceability.md`.

## Case continuity anchors

| | |
|---|---|
| **Case** | John Doe v. Robert Smith (LSH-2026-MVA-770412) — MVA — passenger injury |
| **Lead Counsel** | Atty. Elijah Thorne |
| **Date of loss** | 02/06/2026 · **SOL** 02/06/2028 (Docketed on a two-year limitation for this training file. Confirm the governing state's statute before relying on it.) |
| **Client** | John Doe — Front-seat passenger in the host vehicle |
| **Policy stack** | $10,000 BI / $20,000 HOST UM / $10,000 REL UM = **$40,000** |
| **Health plan** | Peach State Health Plan · PSH-55017742 · GRP-41208 |
| **Critical fact** | Initial 14-Day Treatment Gap, then disrupted care mid-treatment. |

## This day's module

The day is one module, on John Doe's one file: Lectures (its lessons, one uninterrupted discussion) → Practice (its Skill Activities on the file in the CMS, in the order the work happens) → Knowledge Check. A lesson marked (condensed) is a short overview.

**Module 4 — Reductions, Lien Negotiation & ADR**

1. *Lesson* — Statutory Liens, Health Subrogation & Provider Balances
2. *Lesson* — Pro-Rata Distribution & Medical Bill Reduction
3. *Lesson* — Lien Negotiation Calls: the Reduction Request, the Ask and the Payoff Letter (condensed)
4. *Lesson* — The Dual-Tab Net Sheet: Recovery Ledger + Lien Tracker
5. *Lesson* — Release Audits, Trust Accounting & Disbursement Commands
6. *Lesson* — Closing the File: Final Reconciliation, the Closing Memo, the Closing Letter & Retention
7. *Lesson* — Court Hard Rules, SOL Cutoffs & the Master Calendar
8. *Lesson* — UM/UIM Disputes & Resolution Routes
9. *Lesson* — Mediation vs. Binding Arbitration & the UPL Line at Hearings
10. *Lesson* — The Mediation Binder & Exhibit Indexing
11. *Lesson* — Arbitration Exhibits & Evidentiary Rules
12. *Lesson* — The Prior Medical Shield: Answering the Pre-Existing-Condition Defense from the Record
13. *Skill Activity* — Health Subrogation & Statutory Lien Reduction Lab
14. *Skill Activity* — Provider Balance Negotiation Exercises
15. *Skill Activity* — Completing the Final Dual-Tab Net Sheet
16. *Skill Activity* — Prior-Attorney Charging Lien: Investigation, Escalation & Settlement Hold
17. *Skill Activity* — Disbursement Command Triggering: Releases, Hold Cleared, Money Out
18. *Skill Activity* — Routing the UM Impasse: Arbitration or Court
19. *Skill Activity* — Auditing Court Hard Rules & Setting Calendar Cutoffs
20. *Skill Activity* — Calendaring the Mediation: the Session and Every Date That Hangs Off It
21. *Skill Activity* — ADR Rules Matrix & UPL Boundary Mapping
22. *Skill Activity* — Calendaring the Arbitration from the Scheduling Letter
23. *Skill Activity* — Assembling the 6-Section Mediation Binder
24. *Skill Activity* — Assembling the 6-Tab Arbitration Binder
25. *Knowledge Check* — Lien Reduction Verification
26. *Knowledge Check* — Final Accounting Check
27. *Knowledge Check* — ADR & Calendar Compliance Check
28. *Knowledge Check* — Binder Assembly Verification

**End-of-day discussion (trainer):** Keystone's draft release arrives on 08/14/2026 releasing “all other persons, firms, corporations and insurers.” Harbor Point hasn't answered the consent request, and Atty. Thorne is out of the office until Monday. What do you do, and what must not happen before he is back?

---

## Module 4 — Reductions, Lien Negotiation & ADR

**Order:** Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Knowledge Check ➔ Knowledge Check ➔ Knowledge Check ➔ Knowledge Check

### 4.1.1 Statutory Liens, Health Subrogation & Provider Balances

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Not all liens are created equal: classify before you negotiate  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#18` Lien Negotiations/Reduction: Common Types of Liens · `D3#19` Key Legal Doctrines Used for Reduction · `D3#20` Quantum Meruit Principle — Prior Attorney Liens · Newly authored: plan funding status (self-funded vs. fully insured) decides the law that governs a health-plan reduction; the verified-none inventory of absent lienholders

#### 1 · Visual Layout Description

A reducibility ladder fills the left two-thirds: horizontal bars stacked from MOST NEGOTIABLE at the top (PROVIDER LOP, navy) through HEALTH PLAN · FULLY INSURED and WORKERS' COMP (navy-soft) and MEDICARE/MEDICAID (grey) to ERISA SELF-FUNDED at the bottom (dark grey). The two live liens, Riverton Spine & Rehab and Peach State, are solid bars with mono pills, $6,290.00 and $1,860.00; every other bar is hollow with a green ✓ NONE — VERIFIED chip. Beside the ladder, an outlined PRIOR ATTORNEY bar tagged QUANTUM MERUIT. Right third: three cream doctrine cards with orange numbered badges, ① COMMON FUND ② MADE WHOLE ③ COMPARATIVE FAULT, the third greyed. Bottom: a red danger strip, “Unclassified = overpaid or frozen.” The argument: absent liens are checked as carefully as present ones.

#### 2 · Slide Body — Tell Them

*Why:* $40,000 is not John Doe's until every claim on it is found, classified and resolved in writing. Liens are not created equal: a statutory lien bends to a formula, a Health Plan's reimbursement right to a doctrine, a provider's balance to a negotiation. Classify one wrong and you overpay it or freeze the disbursement.

1. Statutory liens (Medicare, Medicaid, a statutory hospital lien, workers' comp) arise by law and bend least. Contractual claims (a plan's reimbursement clause, an LOP) rest on an agreement.
2. Inventory every claimant, absent ones included. Two liens are asserted: Peach State and Riverton Spine & Rehab. Record each “none” with its source: Medicare (the Day 2 SSDI/BCRC check), Medicaid (verified separately: no state-agency interest), hospital (EMS transport declined), workers' comp, prior attorney.
3. Not every payer is a lienholder. Harbor Point's PIP has no reimbursement right (03/02/2026); Crescent Pain & Spine took Peach State's contract rate and cannot balance-bill John Doe.
4. Funding decides the law. A self-funded ERISA plan answers to federal law and its own terms and is very hard to reduce; a fully insured plan is generally subject to state insurance law. Peach State is fully insured: what follows is Atty. Thorne's call.
5. Common fund: a lienholder repaid from a fund the firm's work and advanced costs created shares the cost of recovery. Atty. Thorne asked for the fee share, one-third: $1,860.00 – $620.00 = $1,240.00 (fee and costs would be $1,860.00 × $13,820.08 ÷ $40,000.00 = $642.63).
6. That work was real: the carriers used the 14-Day Gap to call the injury unrelated; the MRI and Dr. Reyes's Causation Letter answered it. Peach State did none of it.
7. Made whole: in many jurisdictions a subrogated insurer takes nothing until the client is fully compensated. John Doe's recovery was capped by coverage; whether he was made whole is Atty. Thorne's analysis.
8. Comparative fault: if the recovery was cut for the client's fault, the lien takes the same cut (20% at fault, 20% off). On Track A no layer took a fault reduction.
9. Quantum meruit: a client may fire a lawyer at any time; the lawyer is then generally owed the reasonable value of the work done, not the contingency fee. Get the time records; strip clerical hours. Never assume none: John Doe knows of no other lawyer at the 10/06 inventory, yet an outside firm asserts a charging lien on 10/14/2026, worked at closing.

> ⚠️ **UPL boundary.** You classify, gather the plan documents, audit and draft the request with its math. The doctrine, the governing law and any figure offered or accepted are Atty. Thorne's: no lien is compromised without his express authority.

> ⚠️ **UPL boundary.** You may tell John Doe what each lienholder asserts and where it stands, never that a lien is invalid or unenforceable.

#### 2 · Slide Body — Show Them

*Every claim on John Doe's $40,000, classified*

| Claimant | Basis · reducibility | On this file |
|---|---|---|
| Riverton Spine & Rehab | Contract (LOP) · high | $6,290.00 billed; audit first |
| Peach State Health Plan | Contract, fully insured · moderate | $1,860.00 asserted |
| Medicare · Medicaid | Statute · low, formula-bound | Medicare: none (Day 2 SSDI/BCRC check); Medicaid: none (verify, record) |
| Hospital · workers' comp | Statute | None asserted: verify, record |
| Prior attorney | Quantum meruit | None known to John Doe at 10/06; Vance & Kettering asserts one 10/14 (worked at closing) |
| Harbor Point PIP | Not a lien | No reimbursement right |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Gross recovery reaches $40,000.00 (10/06/2026) | Run the final inventory, re-verifying the Day 2 lien register, asserted and absent, and classify each as statutory or contractual | CMS → Financial Ledger → Net Sheet → Lien Tracker | Two liens open; Medicare, Medicaid, hospital, workers' comp, prior attorney and PIP each recorded “none” with a source |
| Health Plan lien classified | Obtain the plan documents and route the funding status to Atty. Thorne | CMS → Tasks → Escalate | Fully insured status on file; the governing-law call recorded as his |
| Atty. Thorne chooses the reduction basis | Draft the request naming the doctrine, with the math | CMS → Documents → Outgoing | Doctrine named; $1,860.00 – $620.00 = $1,240.00 shown; held for his approval |
| Prior-attorney question open | Ask John Doe and check the intake record; record the answer | CMS → Case Notes | “No other lawyer known to John Doe” logged with its date and source |

**Best practices & pitfalls**

- Work the most negotiable lien first to build momentum, but resolve every one in writing before disbursement.
- Record a verified “none” the way you record a lien: with its source and its date.
- Name the doctrine and show the math in every Reduction Request.
- ⚠️ Pitfall: treating an ERISA plan like a provider LOP, or a fully insured plan like a self-funded one.
- ⚠️ Pitfall: asking for a “courtesy discount” with no legal basis.
- ⚠️ Pitfall: paying a prior attorney a percentage fee he is no longer entitled to.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Classification | Each claimant statutory, contractual or not a lien, and ranked by reducibility |
| 🤖 AI | **15%** | Inventory of absences | Medicare, Medicaid (sourced separately), hospital, workers' comp, prior attorney and PIP each recorded with a source |
| 🤖 AI | **15%** | Doctrine accuracy | Common fund, made whole, comparative fault and quantum meruit each stated correctly |
| 🤖 AI | **10%** | Common-fund math | $1,860.00 – $620.00 = $1,240.00 |
| 🧑‍🏫 Trainer | **20%** | Governing-law judgment | Sees that the plan's funding status decides the law, and leaves the call to Atty. Thorne |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | No doctrine chosen, figure offered or validity opinion given without counsel |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the inventory, not the negotiation: “How many liens are on John Doe's $40,000?” Most trainees say two. The right answer is two asserted and five checked, each recorded with its source.
- Ask the room: “Peach State paid $1,860.00 on a $3,400.00 injection. Who can come after John Doe for the other $1,540.00?” Nobody: Crescent Pain & Spine took the contract rate and cannot balance-bill.
- Watch for trainees arguing made whole or comparative fault on their own. Naming the doctrines is the Case Manager's job; choosing one is Atty. Thorne's. The same goes for “he was riding to work in Kevin Alvarez's carpool, so is it workers' comp?”: that is a coverage question for him; the Case Manager records that no claim was filed and no lien asserted.
- Quantum meruit gets a line even when the client knows of no other lawyer. On 10/14/2026 Vance & Kettering asserts a charging lien on John Doe's recovery; it is caught before disbursement because the Lien Tracker already has a row for it. A prior attorney found after disbursement is found too late.

---

### 4.1.2 Pro-Rata Distribution & Medical Bill Reduction

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Audit first, then show the lienholder the math  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#21` Increasing the Client's Net · `D3#22` Auditing the Billing Before Asking for a Discount · `D2#40` Finalized Settlement: Final Lien Mitigation (The “Reduction”) · `D2#35` The Execution: Lien Payoff Letters (The “Verification” Paperwork) · Newly authored: the pro-rata distribution rule worked on the BI-only illustration; the pro-rata argument restated on true facts for a fund that covers every lien

#### 1 · Visual Layout Description

Top half: the pro-rata illustration as one long horizontal bar, the $6,179.92 fund, split 23.35% navy (PEACH STATE · $1,443.15) and 76.65% orange (RIVERTON SPINE & REHAB · $4,736.77). A bracket beneath it shows $7,965.00 of liens overhanging the bar's right end in hatched red. At the far right a small card in red: JOHN DOE NETS $0.00. Bottom half: a five-step strip of orange numbered badges, ① Audit ② Correct ③ Calculate ④ Ask with authority ⑤ Confirm in writing, ending in a navy ledger chip, NET SHEET UPDATED. The argument: the math is the leverage, and the audit comes before the ask.

#### 2 · Slide Body — Tell Them

*Why:* Half the job is getting money from the carriers; the other half is keeping it from the lienholders. Every dollar a lien gives up lands in John Doe's net. An honest audit and the pro-rata math move a provider further than any plea for a favor.

1. Audit before you ask. Compare the records to the bill line by line: corrections first, reductions second. Never negotiate a percentage off an inflated bill.
2. Riverton Spine & Rehab billed 34 lines × $185.00 = $6,290.00. The records show 33 visits (16 + 17); the 05/04/2026 line is a duplicate. You negotiate from $6,105.00.
3. Match each line's code to that day's treatment note. Upcoding, unbundling and duplicate dates get a demand for correction, not a request for a favor. No line may fall between 04/02 and 04/21/2026, the disruption.
4. Pro rata: when a fund cannot pay every lien in full and no statute or agreement sets an order, liens of equal priority share what is left after fee and costs in proportion to their amounts. Medicare, a statutory hospital lien or some Medicaid recoveries may take priority; confirm the governing rule. Here: two contractual claims.
5. Had only the $10,000 BI been recovered: $10,000.00 – $3,333.33 – $486.75 = $6,179.92 against $7,965.00 of liens. Peach State $1,860.00 ÷ $7,965.00 (23.35%) → $1,443.15; Riverton $6,105.00 ÷ $7,965.00 (76.65%) → $4,736.77. Compute from the fraction, not the rounded percentage. John Doe nets nothing.
6. Argue on true facts only. On Track A the fund covers both liens: never tell a provider it would take only a share, or that the client will refuse the settlement. The true case: a coverage-capped recovery, fee and costs paid from it, a certain payment now.
7. Common fund (procurement costs): in many states a lienholder must reduce by its proportional share of the fee and costs that created the fund: the retainer's fee percentage (33⅓% pre-suit, 40% once suit is filed) plus its pro rata share of costs. It binds some and persuades others; confirm the rule. Atty. Thorne argues it.
8. Ask with authority: send the written request Atty. Thorne approved, then call billing with his target (never a stock 50%), asking for payment in full in the interest of global resolution. A counter outside it goes back to him.
9. No Payoff Letter, no payment. A signed letter states the payment is full and final satisfaction and that John Doe will not be balance-billed or sent to collections. Pay from the payoff figure, never a statement.
10. Update the ledger the day a reduction is confirmed and show John Doe the savings: $1,860.00 + $6,105.00 = $7,965.00 audited → $1,240.00 + $4,580.00 = $5,820.00 paid ($2,145.00 negotiated), plus the $185.00 duplicate removed at audit.

> ⚠️ **UPL boundary.** You audit, calculate, draft and, inside Atty. Thorne's written authority, make the ask. You never offer or accept a figure outside it, never promise a provider payment, and never tell John Doe a bill is invalid. A reduction is final only on his approval and a signed Payoff Letter.

#### 2 · Slide Body — Show Them

*The pro-rata illustration: BI only, $6,179.92 left after fee and costs*

| Lienholder | Audited lien | Share (lien ÷ $7,965.00) | Paid pro rata |
|---|---|---|---|
| Peach State Health Plan | $1,860.00 | 23.35% | $1,443.15 |
| Riverton Spine & Rehab | $6,105.00 | 76.65% | $4,736.77 |
| Total | $7,965.00 | 100% | $6,179.92 |
| John Doe's net | — | — | $0.00 |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Provider's Final Ledger received | Audit each line against the visit records; request a written correction of any error | Medical Records Requests · CMS → Financial Ledger → Net Sheet → Lien Tracker | 33 visits matched; 05/04/2026 duplicate removed; $6,105.00 |
| Audited balance confirmed | Draft the Reduction Request with the math and obtain Atty. Thorne's written authority | CMS → Documents → Outgoing · CMS → Tasks → Escalate | Authority logged before the request goes or any call is made |
| Reduction agreed | Obtain the signed Payoff Letter; update the Lien Tracker and the Net Sheet | CMS → Financial Ledger → Net Sheet | Full-and-final language on file; net recomputed the same day |

**Best practices & pitfalls**

- Corrections first, reductions second.
- Transparency about savings builds trust: show John Doe his net rising.
- Get every reduction in writing before disbursement.
- ⚠️ Pitfall: negotiating a percentage off an inflated bill.
- ⚠️ Pitfall: agreeing to a reduction verbally with no written confirmation.
- ⚠️ Pitfall: paying from a statement instead of the final payoff figure, or without the full-and-final language.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Audit accuracy | 34 lines against 33 visits; the 05/04/2026 duplicate; $6,105.00 |
| 🤖 AI | **20%** | Pro-rata math | Shares computed from each lien ÷ $7,965.00; $1,443.15 + $4,736.77 = $6,179.92 |
| 🤖 AI | **10%** | Payoff-letter terms | Full and final satisfaction; no balance billing or collections |
| 🤖 AI | **10%** | Ledger update | $7,965.00 audited → $5,820.00 paid ($2,145.00 negotiated); net $20,359.92 |
| 🧑‍🏫 Trainer | **20%** | Negotiation ethics | Argument made on true facts; no bluff about the fund or the client's intentions |
| 🧑‍🏫 Trainer | **20%** | Authority boundary | Every ask inside Atty. Thorne's written authority; nothing final without him |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the BI-only table and cover the last row. Ask: “What does John Doe take home?” Then uncover $0.00. That is why this lesson exists.
- Ask the room: “Riverton billed $6,290.00. What number do you negotiate from?” Anyone who says $6,290.00 has skipped the audit.
- Watch for the old script, “reduce or the client refuses the settlement.” It is a threat, and on Track A it is false: all three layers have tendered their limits (Cardinal State's check arrives 10/13), and after fee and costs $40,000.00 – $13,333.33 – $486.75 = $26,179.92 remains against $7,965.00 of liens. Make them rewrite it on true facts: a coverage-capped recovery, the audited balance, a certain payment now.
- The legal nuance: the common-fund rule binds some lienholders by statute or case law and only persuades others, and an LOP provider is often outside it. Which it is here is Atty. Thorne's call; confirm the governing rule.

---

### 4.1.3 Lien Negotiation Calls: the Reduction Request, the Ask and the Payoff Letter

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR (condensed) · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** From the audited balance to a signed full-and-final payoff  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#21` Increasing the Client's Net · `D3#22` Auditing the Billing Before Asking for a Discount · Newly authored: lien negotiation calls, from the Pre-Demand & Reduction File Review Protocols handout (LSH Knowledge Base, CM Training · Day 4)

#### 1 · Visual Layout Description

A three-step ladder on the left: REDUCTION REQUEST → THE CALL → PAYOFF LETTER, each rung a navy card with an orange badge. On the right, a lien card for Riverton Spine & Rehab: $6,290.00 struck through, $6,105.00 audited, $4,580.00 agreed, with a green FULL AND FINAL stamp.

#### 2 · Slide Body — Tell Them

*Why:* A reduction is won on paper before it is won on the phone. The lienholder needs the audited balance, the reason a reduction is fair and a payoff it can sign. A CM who calls without the request, or pays without the letter, leaves money on the table or reopens a closed bill.

1. Negotiate from the audited balance, never the billed one: Riverton Spine & Rehab $6,105.00, Peach State $1,860.00, $7,965.00 in all.
2. Send the written Reduction Request first: the audited balance, the recovery, the fee and costs, the other liens and the common-fund share, with Atty. Thorne's written authority on file.
3. On the call, make Atty. Thorne's ask and nothing outside it. Note the name, the date and every figure; a counter outside his authority goes back to him the same day.
4. Argue on true facts only: never invent a smaller fund or say the client will refuse the settlement.
5. No Payoff Letter, no payment: the signed letter states full and final satisfaction and no balance billing or collections.
6. Update the Lien Tracker and the Net Sheet the day a reduction is confirmed, and show John Doe the change in his net.

> ⚠️ **UPL boundary.** You draft, calculate and make the authorized ask. You never accept a figure outside Atty. Thorne's written authority, promise a provider payment, or tell John Doe a bill is invalid.

#### 2 · Slide Body — Show Them

*From audited balance to signed payoff (Track A figures)*

| Lienholder | Audited | Agreed | Saved | Payoff Letter |
|---|---|---|---|---|
| Peach State Health Plan | $1,860.00 | $1,240.00 | $620.00 | Signed, full and final |
| Riverton Spine & Rehab | $6,105.00 | $4,580.00 | $1,525.00 | Signed, full and final |
| Total | $7,965.00 | $5,820.00 | $2,145.00 | Both on file before disbursement |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Audited balance confirmed | Draft the Reduction Request with the math; get Atty. Thorne's written authority | CMS → Documents → Outgoing · CMS → Tasks → Escalate | Authority logged before the request goes |
| Lienholder responds | Call with the authorized ask; log the name, date and figures | CMS → Case Notes · CMS → Liens | Counter outside authority routed the same day |
| Reduction agreed | Obtain the signed Payoff Letter; update the Lien Tracker and Net Sheet | CMS → Financial Ledger → Net Sheet | Full-and-final language on file |

**Best practices & pitfalls**

- Paper first, phone second.
- Update the ledger the day a reduction is confirmed.
- ⚠️ Pitfall: agreeing to a reduction on the phone with nothing in writing.
- ⚠️ Pitfall: making an ask outside Atty. Thorne's written authority.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Reduction Request | Audited balance, recovery, fee, costs and other liens stated |
| 🤖 AI | **20%** | Authority | Every ask inside Atty. Thorne's written authority |
| 🤖 AI | **20%** | Payoff Letter | Full and final; no balance billing or collections |
| 🧑‍🏫 Trainer | **20%** | Negotiation ethics | True facts only; no bluff |
| 🧑‍🏫 Trainer | **20%** | Record keeping | Names, dates and figures logged; ledger updated the same day |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Ask the room what goes out before the phone call. Anyone who says the call has skipped the Reduction Request.
- Play the provider who asks “so what's the client getting?” The answer is facts from the Net Sheet, never a threat.

---

### 4.1.4 The Dual-Tab Net Sheet: Recovery Ledger + Lien Tracker

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Final Accounting Check (`d3m4`)  
> **Topic:** One Net Sheet, two streams, every dollar's origin visible  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#35` The Execution: Lien Payoff Letters (The “Verification” Paperwork) · `D2#36` The Execution: The Settlement Statement (The “Net” Sheet) · `D3#23` The Net Sheet: Purpose of a Combined BI/UM Net Sheet · `D3#24` The Net Sheet: Stream 1 (BI) and Stream 2 (UM/UIM) · `D3#25` The Net Sheet: The LSH Corporate Net Sheet Ledger · `D3#26` The Net Sheet: Case Manager Protocols for Dual Settlements · `D3#27` Key Takeaway — The Value of a Case Manager

#### 1 · Visual Layout Description

A wide two-tab spreadsheet card fills the slide, cream with a navy header bar carrying two tabs: RECOVERY LEDGER (active, orange underline) and LIEN TRACKER (navy-soft, set behind). The ledger has three mono columns, TOTAL · STREAM 1 BI · STREAM 2 UM, and rows Gross, Fee 33⅓%, Costs, Peach State, Riverton Spine & Rehab, closing on a heavy orange-ruled NET row: $20,359.92 = $5,089.98 + $15,269.94. A thin orange connector runs from each lien row back to the Lien Tracker tab, labelled PROVED BY PAYOFF LETTER. Bottom-right, a red danger callout: “BI alone: $0.00 to John Doe.” The argument: every figure on the net row traces to its source.

#### 2 · Slide Body — Tell Them

*Why:* John Doe's $40,000 came from three carriers in two streams and goes out as five checks. The Net Sheet shows every dollar's origin and destination before a cent leaves trust. Had only the $10,000 BI been recovered, $6,179.92 would have met $7,965.00 of unreduced liens, and John would have received nothing.

1. One Net Sheet, two tabs. The Recovery Ledger carries the money in and every deduction; the Lien Tracker proves each lien figure the ledger uses. Neither is final until the two tie out.
2. Keep the streams apart. Stream 1, third-party BI: Keystone, $10,000.00. Stream 2, first-party UM: Harbor Point $20,000.00 + Cardinal State (resident relative) $10,000.00 = $30,000.00. Stream 2 opened only because BI was exhausted first.
3. Show where every dollar came from: carriers audit settlements, and a payment counted twice is double-counting on the ledger. Harbor Point's PIP already paid $5,000.00 of the bills: a payment source on the Lien Tracker, never recovery.
4. Price the fee per stream. The retainer sets 33⅓% pre-suit: $3,333.33 on BI + $10,000.00 on UM = $13,333.33. Separate lines matter: fee terms can differ between BI and UM, and the 40% tier applies only once suit is filed.
5. Every cost needs a receipt: Police Report $25.00, records and billing $214.75, certified mail $72.00, MRI disc $25.00, postage and copies $150.00 = $486.75. Charge it once, as one line or split pro rata; this file splits 25% / 75%: $121.69 / $365.06.
6. Reduce liens globally against the combined $40,000.00, not provider by provider per policy, then allocate pro rata: Peach State $310.00 / $930.00; Riverton Spine & Rehab $1,145.00 / $3,435.00.
7. On the Lien Tracker, Balance Owed = Charges – PIP – Health – MedPay – Adjustments. Each lien shows asserted, audited and reduced amounts and its payoff-letter status. No Payoff Letter, no payment.
8. Run the aggregate math on both streams at once: $5,089.98 + $15,269.94 = $20,359.92, and Gross – Fees & Costs – Final Medical Balances: $40,000.00 – $13,820.08 – $5,820.00 = $20,359.92.
9. Test the net against the future care discussed in treatment: possible repeat ESIs ($3,400–$6,800). The settlement is full and final, so no carrier pays more for them. Flag it for Atty. Thorne.

> ⚠️ **UPL boundary.** You build, verify and explain the arithmetic. You may not tell John Doe whether the net is enough, whether a lien is enforceable, or what he should do with the money: Atty. Thorne reviews the Net Sheet and explains it to John before he signs.

#### 2 · Slide Body — Show Them

*The two tabs of John Doe's Net Sheet, and what each proves*

| RECOVERY LEDGER — money in, deductions, net | LIEN TRACKER — every figure proved |
|---|---|
| Gross $40,000.00: Stream 1 BI $10,000.00 (Keystone) · Stream 2 UM $30,000.00 (Harbor Point + Cardinal State). | Peach State: asserted $1,860.00 → reduced $1,240.00 (10/09). |
| Fee 33⅓%: $3,333.33 + $10,000.00 = $13,333.33. | Riverton Spine & Rehab: $6,290.00 → audited $6,105.00 → reduced $4,580.00 (10/12). |
| Costs, receipted: $121.69 + $365.06 = $486.75. | Harbor Point PIP $5,000.00: no reimbursement right (03/02/2026) → $0.00. |
| Liens from the Lien Tracker, 25% / 75%: $1,455.00 + $4,365.00 = $5,820.00. | Crescent Pain & Spine: balance written off, no balance-billing → $0.00. |
| Net to John Doe: $5,089.98 + $15,269.94 = $20,359.92. | Payoff Letter status on every line. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Each settlement check received | Post it to its stream with carrier and check reference | CMS → Financial Ledger → Net Sheet → Recovery Ledger | BI $10,000.00 · UM $20,000.00 + $10,000.00 · total $40,000.00 |
| Cost incurred | Attach the receipt and post it once | CMS → Financial Ledger → Net Sheet → Recovery Ledger | Five receipts = $486.75; no cost charged to both streams in full |
| Lien reduction accepted | Record asserted, audited and reduced figures and the Payoff Letter | CMS → Financial Ledger → Net Sheet → Lien Tracker | Peach State $1,240.00 · Riverton Spine & Rehab $4,580.00 · letters dated |
| Both tabs complete | Tie the Net Sheet to the Trust Ledger and route it to Atty. Thorne | CMS → Financial Ledger → Trust · CMS → Tasks → Escalate | Net $20,359.92 on both; routed before John Doe sees it |

**Best practices & pitfalls**

- One Net Sheet, two clearly separated streams.
- Every reduction carries its reason: an audit finding (the 05/04/2026 duplicate) or a named basis (the one-third procurement-cost reduction).
- Show the streams side by side so John Doe sees what the work produced: Keystone offered $3,500 on the 14-Day Gap and a “degenerative” MRI; the MRI's own “no significant degenerative change at the adjacent levels” helped turn that into $10,000, and the UM stream added $30,000. Financial engineering, not data entry.
- Read the LSH ledger top to bottom in four sections: recovery summary (gross by carrier), fees and advanced costs, the medical provider ledger with its reductions, net to client.
- Accurate financial detail builds client trust.
- ⚠️ Pitfall: mixing BI and UM money on one undifferentiated line.
- ⚠️ Pitfall: charging the same cost to both streams.
- ⚠️ Pitfall: a cost with no receipt, or a lien figure with no Payoff Letter.

#### 3 · Knowledge Check & CM Summary

Verified in Final Accounting Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Stream separation | BI $10,000.00 and UM $30,000.00 on separate streams; PIP kept out of the gross |
| 🤖 AI | **15%** | Fee and cost lines | $3,333.33 + $10,000.00 fee; five receipted costs = $486.75, split $121.69 / $365.06, charged once |
| 🤖 AI | **15%** | Lien Tracker fields | Asserted, audited, reduced and payoff status for each lien; Balance Owed formula applied |
| 🤖 AI | **15%** | Aggregate math | $20,359.92 reached both down the streams and across the total |
| 🧑‍🏫 Trainer | **15%** | Double-counting reasoning | Explains why PIP and written-off balances never appear as payables |
| 🧑‍🏫 Trainer | **10%** | Future-care judgment | Recognises the full-and-final consequence and flags it rather than resolving it |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Explains the arithmetic to John Doe; leaves sufficiency, enforceability and advice to Atty. Thorne |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the why's counterfactual: write $6,179.92 against $7,965.00 on the board and ask what John Doe would have taken home with the BI stream alone. Nothing. Then show $20,359.92.
- Ask the room: “Why does Harbor Point's PIP appear on the Lien Tracker but not in the gross?” The answer is double-counting on the ledger: it already paid $5,000.00 of the bills, and it has no reimbursement right on this file.
- Watch the rounding. 25% of $486.75 is 121.6875, so BI carries $121.69 and UM takes the remainder, $365.06. Compute the second stream as the remainder and the total never drifts by a cent.
- Legal nuance: Peach State is a fully insured plan, so its reduction turned on state law, not ERISA preemption. That was Atty. Thorne's call in the lien negotiation; the CM records the basis and never chooses it.

---

### 4.1.5 Release Audits, Trust Accounting & Disbursement Commands

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Final Accounting Check (`d3m4`)  
> **Topic:** No money moves until every gate behind it is closed  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#33` The Execution: The Release of All Claims (The “Exit” Document) · `D2#34` The Execution: Settlement Disclosure Statement (The “Truth” Document) · `D2#35` The Execution: Lien Payoff Letters (The “Verification” Paperwork) · `D2#36` The Execution: The Settlement Statement (The “Net” Sheet) · `D2#37` The Execution: The Dismissal (The “Court” Filing) · `D2#38` The Execution: W-9 & Comparison of Key Post-Settlement Documents · `D2#39` Finalized Settlement: Boots-on-the-Ground Tasks — Administrative Document Control · `D3#26` The Net Sheet: Case Manager Protocols for Dual Settlements · `D3#29` Case Phase: Disbursement — Core Objectives · `D3#30` Disbursement: The Workflow · `D3#32` Disbursement: Common Challenges & Mitigation · Newly authored: trust-account handling (same-day IOLTA deposit once the release is signed, client endorsement, no disbursement against uncleared funds, disputed shares held in trust); the contingent-fee Settlement Statement (ABA Model Rule 1.5(c) as an example); the UM release's Medicare and confidentiality terms

#### 1 · Visual Layout Description

A horizontal six-gate money path across the slide, each gate a navy card with an orange numbered badge and a mono date pill: ① Releases signed · 08/28 + UM ② Checks into IOLTA · 09/04 · 10/05 · 10/13 ③ Funds clear · 10/20 ④ Statement signed · 10/21 ⑤ Atty. Thorne signs · 10/22 ⑥ Reconciled · $0.00. Above gate ①, a red danger callout quotes Keystone's 08/14 draft, “all other persons, firms, corporations and insurers”, struck through, with –$30,000 beside it. Below the path, a slim grey trust-ledger bar steps from $40,000.00 down to $0.00 in mono. The argument: money moves only after every gate to its left is closed.

#### 2 · Slide Body — Tell Them

*Why:* A settlement is not over when a carrier says yes. It is over when the right release is signed, every check has cleared trust, every lien is paid off in writing and the ledger reads $0.00. One unread line in Keystone's 08/14 draft would have released the UM carriers and cost John Doe $30,000.

1. Read every release line by line before John Doe sees it: who is released, which claims, and what John promises. Keystone's 08/14 draft released “all other persons, firms, corporations and insurers”: Harbor Point and Cardinal State. Flagged, it became the Limited Release John signed 08/28.
2. A BI release must not reach what is still open: the Civic's property-damage claim runs separately with Keystone PD. Both UM consents come before the BI release is signed: here 08/24 and 08/26, before 08/28.
3. Non-admission language is standard: Keystone pays to end the claim, not to admit fault. The indemnity and hold-harmless clause binds John Doe to repay the carrier if a lienholder later pursues it, so every lien must be on the Lien Tracker and paid off in writing.
4. Audit UM releases scope first: Harbor Point's, signed while Cardinal State's claim is open, releases Harbor Point only (“all other … insurers” would reach Cardinal State's $10,000); neither reaches the PD claim. Then indemnity, confidentiality, Medicare (John Doe is no beneficiary: verify it). Terms: Atty. Thorne's call.
5. The Settlement Statement shows John Doe how $40,000.00 becomes $20,359.92, and that it is full and final. Contingent-fee rules commonly require one (for example, ABA Model Rule 1.5(c); confirm the governing rule). Where a cooling-off period applies, no check is cut before it ends.
6. Log each check on arrival; deposit it to IOLTA that day once its release is signed (else secure it for Atty. Thorne), never to operating. John Doe endorses, never the CM. Nothing is disbursed against uncleared funds (here, before 10/20); a disputed share stays in trust. Confirm the governing trust rule.
7. Disbursement serves accuracy, compliance and fraud prevention: Verification (conditions precedent) → Documentation (Payoff Letters, receipts with tax IDs, W-9s) → Authorization (Atty. Thorne signs) → Reconciliation ($0.00).
8. No suit was filed on Track A, so no dismissal is needed. Where a suit is pending, settlement is not over until the court is told: prepare the stipulation of dismissal with prejudice for the attorneys' signatures, docket it and confirm the entry.

> ⚠️ **UPL boundary.** You audit, flag, prepare and verify. You never explain what a release clause means for John Doe, agree wording with an adjuster, or sign or release a trust check: Atty. Thorne settles every term, explains the release and the statement to John, and approves and signs every disbursement.

#### 2 · Slide Body — Show Them

*The money path on John Doe's file: no gate opens before the one to its left has closed*

1. **Releases signed** — Keystone's Limited Release 08/28 (08/14 draft flagged); each UM release before its check.
2. **Checks into trust** — IOLTA deposits 09/04 · 10/05 · 10/13 = $40,000.00.
3. **Funds clear** — 10/20. Nothing is disbursed before it.
4. **Statement signed** — John Doe, 10/21, after Atty. Thorne explains it.
5. **Disbursement** — 10/22: five checks, approved and signed by Atty. Thorne.
6. **Reconcile** — Ledger $0.00; lien satisfactions and John Doe's receipt filed; closing memo 10/30.

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Settlement agreed or tendered | Request the payee's W-9 the same day and send it with the signed release | CMS → Documents → Outgoing | W-9 travels with the release; no accounting hold on the check |
| Carrier's draft release arrives | Audit parties, claims, indemnity, Medicare and confidentiality terms; route a redline memo | CMS → Documents → Release audit · CMS → Tasks → Escalate | Every over-broad line quoted and flagged before John Doe sees the draft |
| Settlement check received | Confirm its release is signed, then deposit to IOLTA the same day and log the clearance date | CMS → Financial Ledger → Trust | Deposits 09/04, 10/05, 10/13 = $40,000.00; all funds cleared by 10/20 |
| Suit pending at settlement (not on Track A) | Prepare the stipulation of dismissal with prejudice for the attorneys' signatures | Court E-Filing · CMS → Calendar | “With prejudice” verified; court entry confirmed and docketed |

**Best practices & pitfalls**

- Match each post-settlement document to its signer: release, John Doe; Payoff Letter, the lienholder; W-9, the payee; stipulation of dismissal, the attorneys.
- Send the release by secure e-signature or schedule an in-person signing; if a notary is required, check the stamp is current and the ID matches “John Doe” exactly.
- Kickback Protocol: when paperwork is missing, say exactly what is missing and give a deadline. A change of circumstance (new address, new payee name) needs updated documents signed by John Doe.
- Cross-reference invoice numbers before any payment is approved: the 05/04/2026 duplicate on Riverton Spine & Rehab's bill is why.
- ⚠️ Pitfall: a General Release that wipes out the UM claims or the open property-damage claim.
- ⚠️ Pitfall: cutting checks against uncleared funds, or during a cooling-off period.
- ⚠️ Pitfall: paying from emailed payment instructions without verifying them by phone to a number on file.

#### 3 · Knowledge Check & CM Summary

Verified in Final Accounting Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Release audit points | Parties, claims released, indemnity, non-admission, Medicare and confidentiality each named; the 08/14 catch-all line identified |
| 🤖 AI | **20%** | Trust sequence | Each release signed before its deposit; deposits 09/04 · 10/05 · 10/13; all cleared by 10/20; signed 10/21; disbursed 10/22; ledger $0.00 |
| 🤖 AI | **10%** | Disbursement workflow | Verification → Documentation → Authorization → Reconciliation, in order |
| 🤖 AI | **10%** | Dismissal rule | None on Track A; with prejudice, signed by the attorneys and entry confirmed where a suit is pending |
| 🧑‍🏫 Trainer | **15%** | Risk reasoning | Explains what each over-broad clause would cost John Doe, in dollars and claims |
| 🧑‍🏫 Trainer | **10%** | Compliance judgment | Treats cleared funds and the signed statement as hard gates, not formalities |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Flags and routes release terms; never interprets them for John Doe or agrees them with an adjuster |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the struck-through line from Keystone's 08/14 draft and ask what it would have cost. The answer, $30,000, is the whole case for auditing every release.
- Put to the room: “Keystone's check is in. Why can't we pay Riverton Spine & Rehab today?” Make them name every gate: cleared funds, the signed statement, the Payoff Letter, Atty. Thorne's signature.
- Watch for trainees who read the indemnity clause as boilerplate. Tie it back to the Lien Tracker: it is John Doe's promise that every lien will be paid, and the CM's records are what make the promise safe.
- Track A has no lawsuit, so no dismissal. Teach it anyway: a file settled after suit is filed is not closed until the court enters the dismissal with prejudice, and a forgotten dismissal leaves a live case on the docket.

---

### 4.1.6 Closing the File: Final Reconciliation, the Closing Memo, the Closing Letter & Retention

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Final Accounting Check (`d3m4`)  
> **Topic:** After $0.00: the four document sets that let a file be archived, and the bill that comes after  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#29` Case Phase: Disbursement — Core Objectives · `D3#33` Final Case Reconciliation Checklist: Net Sheet (The “Money Trail”) · `D3#34` Final Case Reconciliation Checklist: Proof of Delivery/Completion · `D3#35` Final Case Reconciliation Checklist: Compliance & Identity Verification · `D3#36` Final Case Reconciliation Checklist: The Internal “Closing Memo” · `D3#37` Final Case Reconciliation: Retention & Disposition Schedule · `D3#38` Skill Building: Closing a Case — John Doe v. Apex Delivery Final Tasks · Newly authored: the closing letter's contents; the three-way zero-balance proof (bank statement, trust journal, client ledger); the post-closing late-bill drill on Crescent Pain & Spine's contractual write-off

#### 1 · Visual Layout Description

A tall archive box at the right edge of the slide, navy, with a faded orange ARCHIVED stamp, locked behind a gate. Leading to it from the left, four stacked cream cards, each with an empty orange tick box: ① MONEY TRAIL ($40,000.00 IN · $40,000.00 OUT · $0.00) ② PROOF OF DELIVERY (2 SATISFACTIONS · JOHN DOE'S RECEIPT) ③ COMPLIANCE & IDENTITY (PAYER DISCLOSURE · W-9) ④ CLOSING MEMO · 10/30/2026. Above the box, a mono pill: RETENTION · 7 YEARS FROM CLOSING. Bottom-left, a red envelope labelled LATE BILL? arrives after the gate, with a leader line to two chips, MISSED LIEN · BILL NOBODY OWES, and a routing arrow to an ATTY. THORNE card. The argument: $0.00 opens the close; only four verified sets lock it, and the file must still answer the bill that comes after.

#### 2 · Slide Body — Tell Them

*Why:* The Trust Ledger reached $0.00 on 10/22/2026, but John Doe's file is not closed yet. A file archived without its money trail, its satisfactions and its closing memo cannot answer an auditor, a lienholder, or John himself when a bill arrives after the money is gone. Closing is the proof that every dollar landed where the Net Sheet said it would.

1. Nothing is marked Archived until four document sets are verified present: the money trail, proof of delivery, compliance and identity, and the internal closing memo. The test: could an outside auditor trace every dollar from carrier check to payee from the file alone?
2. Set 1, the money trail: an itemized list of every check in and out, each with its bank confirmation number. In: Keystone $10,000.00 (09/04/2026), Harbor Point $20,000.00 (received 10/05), Cardinal State $10,000.00 (received 10/13). Out on 10/22/2026: fee $13,333.33, costs $486.75, Peach State $1,240.00, Riverton Spine & Rehab $4,580.00, John Doe $20,359.92.
3. Close the trail with a zero-balance report: approved budget (the signed Settlement Statement, $40,000.00) – total disbursed ($40,000.00) = $0.00. It is proved three ways, the bank statement, the trust journal and John Doe's client ledger agreeing, and only once all five checks have cleared; an uncashed check is followed up and its funds stay in trust.
4. The trail must also show the controls: a second person reviewed every disbursement against its Net Sheet line, and each payee's payment details were verified by phone to a number already on file. A changed or unverified wiring instruction is a red flag: the payment stops until it is verified, and Atty. Thorne is told.
5. Set 2, proof of delivery: each lienholder's signed satisfaction (paid in full, no future claim against John Doe or the claim), from Peach State and Riverton Spine & Rehab, and John Doe's signed acknowledgment of receipt. A certificate of completion belongs only to a repair paid from trust: the Civic's $9,255.00 repair was paid by Keystone PD directly to the shop.
6. Set 3, compliance and identity: John Doe's signed duplication-of-benefits (payer-disclosure) statement naming every payer (Harbor Point PIP $5,000.00, Peach State $1,860.00, his own $312.40), so every reimbursement claim is known; and a current W-9 for any 1099 reporting, never the intake copy.
7. Set 4, the internal closing memo (10/30/2026): one page a stranger understands in two minutes. Case summary, how it started versus how it ended; discrepancy notes for every figure that moved (Riverton Spine & Rehab $6,290.00 → $6,105.00 → $4,580.00; Peach State $1,860.00 → $1,240.00); exception reports for any policy waiver, or “none granted”. Note that Margaret Doe's Property Damage claim runs separately and stays open.
8. The closing letter goes to John Doe before the file is archived: drafted by you, signed by Atty. Thorne. It states what was received, what was paid and to whom, the satisfactions received, his net and how long the file is kept. It reports facts; anything about what John owes or should do is Atty. Thorne's wording.
9. Retention: tag every document by type and docket its disposition date. The deck's standard schedule: financial records 7 years, then digital deletion; eligibility documents 3–5 years, then archival or off-site storage; correspondence 3 years, then purged from the active server. The firm's schedule and any stricter rule control: this training file keeps the closed file 7 years from closing.
10. A bill after the closing letter: verify it and its link to the accident against the ledger, the EOBs and the Payoff Letters, then classify it: a lien we missed, or a bill nobody owes. Route it to Atty. Thorne the same day, on his instruction ask the provider in writing to correct its account, and tell John Doe that day what you are doing and when he will hear back. The release's indemnity clause is John's promise that every lien was paid: who answers for the bill is Atty. Thorne's call.

> ⚠️ **UPL boundary.** You assemble, verify, draft and route. You never tell John Doe whether he owes a late bill, never sign the closing letter, and never shorten a retention period: Atty. Thorne decides who answers for a bill, signs the letter and approves any departure from the firm's schedule.

#### 2 · Slide Body — Show Them

*Closing John Doe's file: from a ledger at $0.00 to a file that can be archived*

1. **Ledger at $0.00** — 10/22/2026: five checks signed by Atty. Thorne; $40,000.00 in, $40,000.00 out.
2. **Money trail** — Three deposits and five checks, each with its bank confirmation number; zero balance proved by bank statement, trust journal and client ledger once all five clear.
3. **Proof of delivery** — Peach State and Riverton Spine & Rehab satisfactions; John Doe's signed receipt. No completion certificate: no repair was paid from trust.
4. **Compliance and identity** — John Doe's signed payer disclosure (PIP $5,000.00, Peach State $1,860.00, his own $312.40); a current W-9.
5. **Closing letter** — Drafted by the CM, signed by Atty. Thorne: what was paid, to whom, and the satisfactions received.
6. **Closing memo** — 10/30/2026: how it started versus how it ended, discrepancy notes, exceptions; the Property Damage claim noted as open.
7. **Retention, then archive** — Every document tagged by type; disposition review docketed 7 years from closing.

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Ledger at $0.00 (10/22/2026) | Build the money trail: three deposits, five disbursements, confirmation numbers and the zero-balance report | CMS → Financial Ledger → Trust | Bank statement, trust journal and client ledger agree at $0.00 once all five checks clear |
| Satisfactions and John Doe's receipt returned | File proof of delivery, the payer-disclosure statement and a current W-9; draft the closing letter | CMS → Documents · CMS → Documents → Outgoing | All four sets present; letter signed by Atty. Thorne and sent before archive |
| Closing memo written (10/30/2026) | Tag every document by type and docket each disposition date | CMS → Case Summary · CMS → Calendar | Discrepancies explained; disposition review 7 years from closing |
| A bill arrives after the closing letter | Verify and classify it, route it to Atty. Thorne, and tell John Doe the same day | CMS → Tasks → Escalate · Email Workspace | Routed and John Doe told the day it arrives; correction request drafted |

**Best practices & pitfalls**

- Run the audit-ready test before you ask to archive: give the file to someone who never worked it and ask them to trace Riverton Spine & Rehab's $4,580.00 from deposit to payee.
- Collect the lien satisfactions and John Doe's receipt with the payment; chase anything missing with the Kickback Protocol: exactly what is missing, and by when.
- Write the closing memo for a stranger years from now: dates, figures and reasons, no adjectives.
- Ask the late-bill question first: a lien we missed, or a bill nobody owes? Drill: a statement for Crescent Pain & Spine's $1,540.00 is answered by Peach State's EOB, a contractual write-off Crescent cannot balance-bill.
- Two-person review on every disbursement, and payment details verified by phone to a number already on file.
- ⚠️ Pitfall: archiving at $0.00 without John Doe's signed acknowledgment of receipt or the lien satisfactions.
- ⚠️ Pitfall: telling John Doe a late bill is “not our problem”, or telling him he owes it.
- ⚠️ Pitfall: destroying financial records before their retention date, or docketing no disposition date at all.

#### 3 · Knowledge Check & CM Summary

Verified in Final Accounting Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Four document sets | Money trail, proof of delivery, compliance and identity, closing memo, each with John Doe's item |
| 🤖 AI | **15%** | Money trail and zero balance | Three deposits and five disbursements itemized with confirmation numbers; $40,000.00 – $40,000.00 = $0.00 proved three ways |
| 🤖 AI | **15%** | Closing memo and letter | Memo: summary, discrepancy notes (Riverton Spine & Rehab, Peach State), exceptions, open Property Damage claim; letter for Atty. Thorne's signature before archive |
| 🤖 AI | **10%** | Retention and late bill | Documents tagged and disposition docketed 7 years from closing; late bill verified, classified and routed the same day |
| 🧑‍🏫 Trainer | **15%** | Audit-ready judgment | Refuses to archive at $0.00 until every set is present, and says what each missing item would cost |
| 🧑‍🏫 Trainer | **10%** | Client communication | Tells John Doe the same day what is being done about a late bill and when he will hear back, without blame or promises |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Never says whether John Doe owes a bill; the closing letter is Atty. Thorne's to sign; no change to the retention schedule |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Start at 10/22/2026 with the ledger at $0.00 and ask: “Can we archive today?” Make the room list what is still missing: confirmation numbers, both satisfactions, John Doe's receipt, the payer disclosure, a current W-9, the closing letter and the memo.
- The late-bill drill: a statement for Crescent's $1,540.00 arrives after the closing letter. Model answer: verify it against Peach State's EOB (a contractual write-off, no balance billing), route it to Atty. Thorne the same day, on his instruction ask Crescent in writing to correct its account, and tell John Doe today what is happening. Whether he owes anything is Atty. Thorne's to say.
- Retention trips people. The deck's schedule purges correspondence from the active server at 3 years, but this firm keeps the closed training file 7 years from closing, and the stricter rule controls. Ask which of John Doe's documents are financial records.
- Legal nuance: the payer disclosure is not a promise that nothing else paid. Other sources did, and recovering those bills is generally allowed (collateral source; confirm the governing rule). Its job is to make sure every reimbursement claim is known, so the release's indemnity promise can be kept.

---

### 4.1.7 Court Hard Rules, SOL Cutoffs & the Master Calendar

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** The dates the law sets, and the earlier dates the firm dockets  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D5#28` Master Timeline & Deadline Calculations · `D4#18` Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules · Newly authored: weekend roll direction (forward count → next business day; backward count → earlier business day) · Newly authored: SOL internal hard date and 90-day internal filing cutoff (firm rule configured for this training file), kept live after filing until Atty. Thorne releases them · Newly authored: scheduling-order entry (read each verb) and RFAs docketed separately for the deemed-admission risk · Newly authored: calendar-error risk (later or missing costs rights; earlier costs time)

#### 1 · Visual Layout Description

A horizontal master-calendar ribbon across the full slide width on a cream ground, running 10/2026 to 02/2028. Court hard rules stand above the ribbon as navy pins with mono date pills (11/13/2026 · 01/04/2027 · 03/31/2027 · 05/28/2027); forum dates hang below it as orange pins (03/11 · 03/18 · 06/02 · 06/11 · 06/22/2027). At the far right, a red danger flag on 02/06/2028 reads SUNDAY — NEVER RELY ON IT, and two orange pins step back from it: 02/04/2028 INTERNAL HARD DATE and 11/05/2027 FILING CUTOFF. Under the ribbon, two arrow chips pointing opposite ways: a right-pointing FORWARD COUNT → NEXT BUSINESS DAY and a left-pointing BACKWARD COUNT: EARLIER BUSINESS DAY. The argument: the dates the CM dockets sit earlier than the dates the law allows.

#### 2 · Slide Body — Tell Them

*Why:* Keystone's stonewall on the 14-Day Gap moved John Doe's file onto court time. From 09/24/2026 its dates are set by rule, order and statute, and they do not move because a carrier is silent or a client is unreachable. One mis-counted day can concede a fact or end a claim.

1. A hard rule is a date fixed by statute, court rule, court order or a forum's rules. Miss one by a day and the claim can go: a complaint filed after the SOL can be dismissed with prejudice. Every date here is configured for this training file; confirm the court's rules.
2. Count the court's way: exclude the trigger day, include the last. Robert Smith was served 10/14/2026; 30 days → answer due 11/13/2026. Answer periods commonly run 20 to 30 days (21 in federal court).
3. The mailbox trap: many courts add 3 days when a paper is served by mail, and this file's rule set does. E-service is rule-specific: our 12/14/2026 e-served discovery is due back 01/13/2027, nothing added.
4. A forward count that lands on a weekend or court holiday moves to the next business day. A backward count from an event moves to the earlier one. Never roll a backward deadline forward.
5. Unanswered Requests for Admission may be deemed admitted. Docket John Doe's 15 RFAs as their own entry with their own alerts, never folded into “discovery due”.
6. Docket the SOL to internal dates. The firm never relies on a weekend roll-forward: the Sunday SOL, 02/06/2028, becomes an internal hard date of 02/04/2028 (Fri) and an internal filing cutoff 90 days before that (11/06/2027, a Saturday → 11/05/2027).
7. Filing on 09/24/2026 doesn't release the SOL. Whether any claim or party still depends on it is Atty. Thorne's analysis; both internal dates stay live until he releases them in writing.
8. Enter a Scheduling Order the day it arrives and read each verb: mediation “completed by 03/31/2027” is a deadline for the session to be over, not the session date. Plaintiff's expert disclosure (03/15/2027) is ours.
9. The moment a matter is routed to a forum, hard-code its dates on the master calendar and monitor them. Give each an owner, its trigger document, the arithmetic and warning alerts. A deadline that lives only in an email isn't calendared.
10. When a rule is unclear, docket the conservative date and flag it to Atty. Thorne. A date pulled earlier costs time; one pushed later, or left off, costs rights.

> ⚠️ **UPL boundary.** You compute, docket, verify and flag. You may not decide which rule governs, agree an extension with opposing counsel, or tell John Doe what a missed date would do to his case. Those are Atty. Thorne's.

#### 2 · Slide Body — Show Them

*This file's hard rules, counted (as configured for this training file)*

| Trigger | Rule and count | Docket |
|---|---|---|
| Smith served 10/14/2026 | Answer: 30 days | 11/13/2026 (Fri) |
| Discovery mailed 12/01/2026 | 30 + 3 = 01/03/2027 (Sun) → forward | 01/04/2027 (Mon), RFAs too |
| Mediation 03/18/2027 | Statement and binder 7 days before | 03/11/2027 (Thu) |
| Hearing 06/22/2027 | Exhibits 20 days before; brief 10 days before = 06/12 (Sat) → back | 06/02/2027; 06/11/2027 (Fri) |
| SOL 02/06/2028 (Sun) | Hard date before the weekend; cutoff 90 days earlier = 11/06/2027 (Sat) → back | 02/04/2028; 11/05/2027 (Fri) |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Scheduling Order entered 12/10/2026 | Enter every date with its trigger, rule, owner and alerts; read each verb | Docket System | All six order dates entered that day; “completed by” entered as a deadline |
| Discovery served by mail 12/01/2026 | Count 30 + 3, move the Sunday forward, enter the RFAs separately | Case Docket & Calendar Conflict Resolver | Responses and RFAs both at 01/04/2027; deemed-admitted flag set |
| SOL review | Set the internal hard date and the internal filing cutoff | CMS → Calendar | 02/04/2028 and 11/05/2027 docketed; nothing relies on 02/06/2028 |
| Arbitration invoked 04/05/2027 | Hard-code the hearing, exhibit-exchange and brief dates | CMS → Calendar → Master calendar | 06/02, 06/11 and 06/22/2027 entered with alerts the same day |

**Best practices & pitfalls**

- Record the trigger, the rule and the arithmetic on every entry, so anyone can re-check it.
- Add warning alerts ahead of each hard date.
- Calendar the conservative date when a rule is unclear, and flag it.
- ⚠️ Pitfall: counting the trigger day as day one.
- ⚠️ Pitfall: rolling a backward-counted deadline forward to Monday.
- ⚠️ Pitfall: docketing the SOL on its Sunday and relying on the roll-forward.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Deadline arithmetic | Answer 11/13/2026; responses 01/04/2027 with the 3 mail days; brief 06/11/2027 |
| 🤖 AI | **15%** | SOL cutoffs | Internal hard date 02/04/2028 and filing cutoff 11/05/2027, arithmetic shown |
| 🤖 AI | **15%** | Roll direction | Forward counts move later, backward counts earlier; none rolled the wrong way |
| 🤖 AI | **10%** | Entry completeness | Trigger, rule, owner and alerts on every hard date; RFAs entered separately |
| 🧑‍🏫 Trainer | **25%** | Risk judgment | Explains why a late or missing entry is worse than an early one, and dockets the conservative date |
| 🧑‍🏫 Trainer | **15%** | Authority boundary | Rule questions and extensions routed to Atty. Thorne; no legal consequence explained to the client |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open on the SOL: write 02/06/2028 on the board and ask what day of the week it is. Then show the two orange pins stepping back from it.
- Ask the room: “Discovery was mailed to us on 12/01/2026. When are John Doe's responses due?” Make them say every step aloud: trigger day out, 30 days, 3 for mail, Sunday, Monday.
- The most often failed point is direction. Forward counts move to the next business day, backward counts to the earlier one; rolling the 06/12/2027 brief to Monday files it late.
- Every date on this slide is configured for this training file. Say so, and say who confirms the real rule: Atty. Thorne. The CM computes and dockets; the CM never agrees an extension.

---

### 4.1.8 UM/UIM Disputes & Resolution Routes

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** A claim against your own client's carrier, and the two roads out of an impasse  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#33` The Execution: The Release of All Claims (The “Exit” Document) · `D3#5` UM Demand: Investigation & Evaluation — The Weak File vs. The Legal Trap · `D3#19` Key Legal Doctrines Used for Reduction · `D4#2` Introducing the Neutral: Mediator vs. Arbitrator — Expertise & Background · `D4#19` Arbitration Operational Track 2: Logistics & Setup Protocols · LSH Claims Specialist: UM/UIM coverage and exhaustion · Newly authored: the first-party vs. third-party mindset shift stated as the CM's opening question on a UM dispute · Newly authored: the three-step UM dispute flow (claim submission → impasse → resolution route) with the route read from state law and the policy clause, never chosen · Newly authored: bad faith kept off the route fork as a separate suit above the limits, reserved to counsel; each UM layer read and docketed on its own clause

#### 1 · Visual Layout Description

A three-step flow across the full slide on cream, each step a white orange-bordered card that opens as a pop-up context card on click. ① CLAIM SUBMISSION · UM DEMAND PACKAGE (03/22/2027), its card listing the proof of exhaustion. ② DISPUTE · IMPASSE (03/31 $8,000 · 04/02 $6,000), its card holding the impasse memo. ③ RESOLUTION ROUTE, drawn as a fork: the upper arm, heavier and navy, DEMAND FOR ARBITRATION · HARBOR POINT CLAUSE, running to a mono date strip 06/22/2027; the lower arm, outlined, FILE SUIT AGAINST THE CARRIER, tagged STATE LAW BARS OR LETS THE INSURED OPT OUT. A separate red-bordered card stands off to the side, deliberately off the fork: BAD FAITH · A SEPARATE SUIT · ABOVE THE POLICY LIMIT · ATTY. THORNE DECIDES. Above the fork, a navy banner: THE ROUTE IS READ, NEVER CHOSEN. Along the top edge, two facing chips: THIRD PARTY → ROBERT SMITH'S CARRIER and FIRST PARTY → OUR OWN CLIENT'S CARRIER.

#### 2 · Slide Body — Tell Them

*Why:* A BI claim is made against the driver who caused the crash. A UM claim is made under coverage that protects John Doe himself, and that changes what the file is. Harbor Point and Cardinal State are not opponents the way Keystone is: they are parties to John Doe's own contract, with duties to him and defences drawn from his own policy. When $8,000 and $6,000 came back against $30,000 of UM limits, the file did not simply head for court the way the BI claim would have: Harbor Point's policy says where a UM dispute is decided, and that clause, with the governing state law, is what the Case Manager has to read before a single date is docketed.

1. Know which kind of claim you are working. Third-party: filed against the at-fault driver's carrier, here Keystone Mutual for Robert Smith. First-party: filed under coverage that protects John Doe himself, here Harbor Point (Host UM) and Cardinal State (Relative UM). In plain words for the client: a third-party claim is a claim against the other driver's insurance; a first-party claim is a claim on insurance that covers you, usually a policy you pay premiums on, and for John Doe the policies that cover him as a passenger and as his mother's household member. The evidence is the same; the relationship, the duties and the route out are not.
2. John Doe owns no car and has no auto policy of his own, so no policy of his is a UM layer. The one other policy at the scene, Margaret Doe's Bluewater Auto policy on her parked Civic, carries no UM: she rejected it in writing on 03/14/2024, so it adds nothing. He reaches UM by status instead: as an occupant of Kevin Alvarez's Escape (Harbor Point) and as a resident relative of Margaret Doe (Cardinal State).
3. When a UM negotiation reaches impasse you do not reach for a complaint by reflex. The route is set by the governing state law and by the dispute-resolution clause in the policy the claim is made under: read both, on each layer, before anything is calendared.
4. Route 1, mandatory arbitration, is the common one. Many UM/UIM policies carry a binding arbitration clause, as Harbor Point's does. The firm does not file a traditional lawsuit; it files a formal Demand for Arbitration. Carriers favour it because it bypasses a jury, narrows discovery and resolves a contract dispute faster and more cheaply.
5. Route 2, standard litigation, runs in two situations. Some states forbid mandatory arbitration clauses in auto policies, or let the policyholder opt out; where the clause does not bind, a failed UM negotiation becomes a civil suit filed directly against the carrier. Separately, where a carrier has unreasonably delayed, denied or mishandled the claim, the firm may bring an Insurance Bad Faith action, which can reach beyond the UM policy limit. Whether either applies is Atty. Thorne's analysis, never yours.
6. Read each layer on its own. Harbor Point's arbitration clause does not speak for Cardinal State: get Cardinal State's UM form and its dispute-resolution and other-insurance clauses from the certified policy and route both to Atty. Thorne. Whether the two are heard together is his call; on this file they were consolidated into the 06/22/2027 hearing.
7. A route carries its own clock. Every layer has its own limitation on filing suit or serving a demand for arbitration, set by the policy or by statute, and it is not the tort SOL of 02/06/2028. Ask Atty. Thorne each policy's deadline in writing and docket only from his written answer.
8. Track the route in the CMS the day it is set, so nobody has to guess what this file is doing: the ADR tab with its type UM / UIM arbitration and How It Was Set as Required by the policy or contract, the provider, the hard dates, and the case status moved to the route it is actually on.
9. Nothing about the route changes what the UM claim has to prove. The Demand Package still carries the injuries, the Specials of $16,401.40, the wage loss and the documented proof that Keystone's $10,000 was exhausted; and the 14-Day Gap will be put to John Doe again at the hearing, by a carrier reading his own policy.

> ⚠️ **UPL boundary.** You read the clause and the statute, lay both before Atty. Thorne, docket what he confirms and tell John Doe what happens next procedurally: the date, the place, what to bring, who will be in the room. Which route governs, whether an offer is unreasonably low, and whether Harbor Point's handling amounts to statutory bad faith are legal opinions, and they are Atty. Thorne's alone.

> ⚠️ **UPL boundary.** Said to John Doe, the line sounds like this. Procedure: “We submitted the UM Demand Package to Harbor Point and Cardinal State today; if we reach an impasse, the policy's terms set the next step, and Atty. Thorne will confirm which one.” Never a view on value or conduct: “Atty. Thorne will evaluate whether the carrier's offer amounts to statutory bad faith.”

#### 2 · Slide Body — Show Them

*The UM dispute flow, worked on John Doe's file*

| Step | Action | What it takes on this file |
|---|---|---|
| 1 · Claim submission | UM Demand Package | Served 03/22/2027 to Harbor Point and Cardinal State, after Keystone's tender at the 03/18/2027 mediation: injuries, records, $16,401.40 in Specials, the wage letter, and documented proof that Robert Smith's $10,000 BI limit was exhausted and consented to |
| 2 · Dispute | Impasse | Harbor Point offers $8,000 (03/31/2027) and Cardinal State $6,000 (04/02/2027) against $30,000 of UM limits; both hold on 04/05/2027, citing the gap; impasse memo to Atty. Thorne |
| 3 · Resolution route | Demand for Arbitration, or file suit against the carrier | Read the governing state law and each policy's clause. Harbor Point's UM policy has a binding arbitration clause: invoked 04/05/2027, heard 06/22/2027 before Laura Whitcomb, Esq. Where no clause binds, a civil suit against the carrier; a bad-faith action is a separate suit, and Atty. Thorne's call |
| Not a route | Margaret Doe's Bluewater Auto policy, on her parked Civic | UM/UIM rejected in writing by Margaret 03/14/2024, and John owns no car: there is no third layer and no third route |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| UM offers come back low (03/31 and 04/02/2027) | Write the impasse memo; pull Harbor Point's and Cardinal State's dispute-resolution clauses from the certified policies | CMS → Case Notes · CMS → Insurance tab → Coverage Matrix | Memo to Atty. Thorne the same day, with both clauses attached and neither interpreted |
| Clauses and the governing statute in hand | Lay the route options before Atty. Thorne as findings, with each layer's own filing or demand deadline as a question | CMS → Tasks → Atty. Thorne | Both layers presented separately; no route recommended; every deadline asked, not assumed |
| Route decided in writing | Record it, set the case status and open the ADR entry | CMS → ADR tab · CMS → Case Status | ADR Type UM / UIM arbitration; How It Was Set Required by the policy or contract; status matches the route |
| Arbitration invoked 04/05/2027 | Docket the hearing and its backward-counted dates; tell John Doe what happens procedurally | CMS → Calendar → Master calendar | 06/02, 06/11 and 06/22/2027 entered with alerts; John Doe told the date, place and what to bring, and nothing about value |

**Best practices & pitfalls**

- Say which kind of claim you are on before you say anything else about it: first party or third party decides everything that follows.
- Quote the clause in your memo and let it speak; a paraphrase is already an interpretation.
- Docket each UM layer's own deadline separately, from Atty. Thorne's written answer.
- ⚠️ Pitfall: filing, or telling the client the firm is filing, a lawsuit when the policy sends the dispute to arbitration.
- ⚠️ Pitfall: reading Harbor Point's arbitration clause onto Cardinal State's policy.
- ⚠️ Pitfall: telling John Doe the carrier is acting in bad faith, or that he can recover above his limits.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | First party vs. third party | Names Keystone as the third-party claim and Harbor Point and Cardinal State as first-party claims under John Doe's own contract, and says what changes |
| 🤖 AI | **20%** | The two routes | Mandatory arbitration by Demand for Arbitration (Harbor Point's clause) vs. a civil suit against the carrier where state law bars the clause or allows opt-out; bad faith as a separate suit above the limits |
| 🤖 AI | **15%** | Route is read, not chosen | Reads the governing state law and each layer's own clause; Cardinal State read separately from Harbor Point |
| 🤖 AI | **10%** | Tracked and docketed | ADR entry typed UM / UIM arbitration and set by the policy; each layer's own deadline asked of Atty. Thorne and docketed from his written answer |
| 🧑‍🏫 Trainer | **10%** | Bluewater handled correctly | Knows John owns no car and that Margaret's Bluewater policy carries no UM (she rejected it in writing 03/14/2024), and reaches UM by occupancy and residency instead |
| 🧑‍🏫 Trainer | **10%** | Client explanation | Explains the route to John Doe procedurally: what a Demand for Arbitration is, the date, the place, what to bring |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | Offers no view on which route governs, on whether an offer is unreasonable, or on bad faith; routes all three to Atty. Thorne |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the question, not the answer: “Whose insurance company are we fighting?” Keystone is the at-fault driver's. Harbor Point and Cardinal State are John Doe's own. Let the room sit with that before any procedure is taught.
- Humanize the jargon in one breath and keep it: a third-party claim is a claim against the other driver's insurance; a first-party claim is a claim against the insurance you pay for yourself. Trainees who keep saying “the other side” about Harbor Point have not made the shift.
- Ask: “The UM negotiation has failed. What do we file?” Anyone who says “a lawsuit” gets the clause read to them. The route is read off the policy and the state's law, never picked because it is the one they know.
- Watch the Bluewater trap. Some trainees will look for UM on a policy of John Doe's own, because that is where the textbook puts it. He owns no car and has none. The Bluewater policy is Margaret's, on her parked Civic, and she rejected its UM in writing on 03/14/2024. He reaches UM as an occupant of Kevin Alvarez's Escape and as a resident relative of Margaret Doe.
- Hold the bad-faith card off the fork on purpose. Trainees find it exciting because it reaches above the limits; that is exactly why saying it to John Doe, or to Marcus Bell, is Atty. Thorne's to do and not theirs.

---

### 4.1.9 Mediation vs. Binding Arbitration & the UPL Line at Hearings

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** Two neutrals, two standards, one boundary  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#5` Mediation Protocols for CMs: Logistics & Scheduling · `D4#16` Case Phase: Arbitration — The Anatomy of a PI Arbitration · `D4#17` Arbitration: Operational Mindset — From Compromise to Trial-Ready · `D4#19` Arbitration Operational Track 2: Logistics & Setup Protocols · `D4#20` Ethics & Boundaries: What You Can and Cannot Do at Hearings (UPL) · Newly authored: court-ordered mediation compels attendance, not agreement · Newly authored: where ADR lands on the timeline — pre-litigation and post-filing mediation, contractual pre-filing arbitration and agreed post-filing arbitration, and the Standard Case Progression Roadmap

#### 1 · Visual Layout Description

Two forum cards face each other across the slide, joined by a bold orange arrow labelled COMPROMISE → TRIAL-READY. Left, a navy-soft card: MEDIATION · 03/18/2027 · HON. CARLA BENTON (RET.), with three chips: NON-BINDING · CONFIDENTIAL · FACILITATES. Right, a solid navy card, visibly heavier: BINDING ARBITRATION · 06/22/2027 · LAURA WHITCOMB, ESQ., with three chips: ACTS AS JUDGE · BINDING AWARD · APPEAL LIMITED, and a mono hard-date strip beneath it (06/02 · 06/11 · 06/22/2027). Across the bottom, a full-width red-bordered UPL bar in two halves: CM CAN (observe · log directives · update the CMS) in navy, CM NEVER (argue · speak on the record · speak for John Doe · negotiate) in red. The bar spans both cards: the line is the same at both tables. Above both cards, a slim full-width timeline strip marks where ADR can land: BEFORE FILING (pre-litigation mediation · pre-filing arbitration clause) on the left in navy-soft, a vertical orange COMPLAINT FILED marker in the middle, and AFTER FILING (court-ordered mediation · agreed binding arbitration) on the right, with both of this file's sessions pinned on the right-hand half.

#### 2 · Slide Body — Tell Them

*Why:* Two neutrals, three months apart. Hon. Carla Benton (Ret.) can only help the parties agree; Laura Whitcomb, Esq. decides, and her award stands with almost no appeal. Prepare for both alike and you bring a compromise file to a trial-ready hearing.

1. ADR is not one fixed step on the timeline. Mediation and arbitration can each come before a lawsuit is filed or after it; which it is depends on the process, the court's local rules and how the negotiations go. Neither is a stop between the demand and a jury trial that every file makes.
2. Before suit: pre-litigation mediation usually follows the client's completed treatment and the formal demand, when both sides would rather avoid court costs, legal fees and a public record. Pre-filing arbitration comes from a contract the client signed before or during the incident — rideshare user terms, a treatment consent, a nursing-home agreement — and can bar a standard court lawsuit altogether. Whether a clause applies to this file is Atty. Thorne's analysis, never yours.
3. After suit: most personal injury mediations are post-filing, many of them court-ordered during discovery before a trial date is assigned; parties can also agree to pull a filed case out of court into binding arbitration instead of a long jury trial. On this file Keystone's stonewall sent the matter to suit, then to the court-ordered mediation of 03/18/2027 and, under Harbor Point's UM clause, to binding arbitration on 06/22/2027.
4. Say both words in plain language before you use them with John Doe. Non-binding (mediation): both sides have to agree, and nobody is forced to settle. Binding (arbitration): the arbitrator's decision is final and enforceable like a court order. You explain which process is scheduled and when; what either one does to his claim is Atty. Thorne's to tell him.
5. Mediation is facilitated compromise: non-binding, confidential under the governing statute or court rule (exceptions include a signed settlement). Court-ordered means John Doe must attend, not agree. When a deal binds (party signatures, or counsel with authority) varies: confirm the governing rule. Here: 03/18/2027.
6. Binding arbitration, as Harbor Point's clause provides, is an adversarial hearing: the arbitrator acts as judge; courts review her award only on narrow grounds. Confirm the policy and statute; some allow a trial de novo. Here BI settled at mediation, and the UM carriers' dispute over the gap went to a decision.
7. Know the limits. Split limits cap BI per person (Keystone: $10,000, PD separate); a combined single limit is one figure for BI and PD. Damages found are reduced first by the $10,000 BI paid; Harbor Point's add-on UM pays above that up to $20,000, Cardinal State's $10,000 behind it. How an award applies is Atty. Thorne's analysis.
8. Mediation logistics: 3–4 windows from Atty. Thorne, John Doe and opposing counsel before contacting the mediator; a private room (breakouts if virtual); interpreter checked; Atty. Thorne's 2-hour buffer; video open 15 minutes early so he can brief John Doe; you run the technology check only.
9. Every window rejected? Log the pushback that day and escalate to Atty. Thorne. Never accept “a quick video mediation next Tuesday” unchecked.
10. Arbitration setup: align 3–4 blocks with opposing staff; messages to the arbitrator's office (scheduling, fees, retainer) go only as Atty. Thorne directs, in writing, all counsel copied, never on the merits. Route the retainer to accounting, payment confirmed in writing; set the room or secure video.
11. Trial-ready: audit every exhibit, lock every deadline. At the hearing, document testimony and the arbitrator's reactions; log each bench directive as given, calendar it, memo Atty. Thorne that day.
12. The Golden Rule: a CM never argues, speaks on the record or represents John Doe. Asked about a bill: say you are the Case Manager providing administrative assistance, defer to Atty. Thorne, hand him the document.

> ⚠️ **UPL boundary.** At both sessions you run logistics, exhibits, technology and notes. You never speak for John Doe, argue, negotiate or answer a neutral on the merits, or tell John Doe whether to accept a number: that is his call with Atty. Thorne.

#### 2 · Slide Body — Show Them

*The two forums on John Doe's file*

| MEDIATION — compromise · 03/18/2027 | BINDING ARBITRATION — decision · 06/22/2027 |
|---|---|
| Hon. Carla Benton (Ret.) facilitates; she decides nothing. | Laura Whitcomb, Esq. acts as judge; her award binds. |
| Attendance ordered, not agreement; when a deal binds varies. | Court review on narrow grounds only. Trial-ready. |
| Confidential; statement and binder due 03/11/2027. | Exhibits 06/02/2027; brief 06/11/2027. |
| Across: Robert Smith, defended by Keystone. | Across: Harbor Point and Cardinal State. |
| CM: windows, rooms, interpreter, buffer, notes. | CM: retainer, setup, notes, directives. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Order requires mediation by 03/31/2027 | Collect 3–4 windows from Atty. Thorne, John Doe and opposing counsel, then contact the mediator's office | Calendaring Simulators | Windows logged before the mediator is contacted; session inside 03/31/2027 |
| Opposing counsel rejects every window | Log the pushback; escalate for an attorney-to-attorney call | CMS → Tasks → Escalate | Logged and escalated the same day |
| Arbitrator's fee schedule and retainer request received | Confirm the schedule; route the retainer to accounting; send internal invites | CMS → Tasks → Accounting · CMS → Calendar | Payment confirmed in writing before the hearing |
| Directive from the bench | Log it as given; calendar it; memo Atty. Thorne | CMS → Case Notes · CMS → Calendar | Directive dated and calendared the same day |

**Best practices & pitfalls**

- Your hearing notes become Atty. Thorne's post-hearing roadmap.
- Collect every party's windows before the neutral's office hears from you.
- Confirm the retainer payment in writing; unpaid retainers delay hearings.
- ⚠️ Pitfall: bringing a mediation-quality binder to an arbitration.
- ⚠️ Pitfall: “helpfully” answering the arbitrator directly.
- ⚠️ Pitfall: logging bench directives the next day from memory.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Forum distinctions | Non-binding, confidential compromise vs. binding award with limited appeal, each tied to its neutral; both terms said in plain words |
| 🤖 AI | **10%** | ADR timing | Each forum placed before or after filing, with what puts it there: the demand, the court's rules, a signed arbitration clause, the parties' agreement; this file's two sessions placed post-filing |
| 🤖 AI | **15%** | Logistics protocol | 3–4 windows first; rooms or breakouts; interpreter; 2-hour buffer; retainer confirmed in writing |
| 🤖 AI | **5%** | Hearing duties | Observe and document, log directives as given, calendar and memo the same day |
| 🤖 AI | **10%** | Limits in play | Split vs. combined single limit explained; $20,000 and $10,000 UM limits named |
| 🧑‍🏫 Trainer | **15%** | Mindset shift | Explains what changes operationally from compromise to trial-ready |
| 🧑‍🏫 Trainer | **25%** | UPL boundary | Never speaks for John Doe, argues, negotiates or answers a neutral; the bill script defers to Atty. Thorne |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Start on the roadmap, before either neutral is named. Ask the room where ADR sits between the demand and a trial, and let them argue about it: the answer is that it can sit on either side of the filing. Then put the four boxes up — mediation before suit, mediation after suit, arbitration before suit, arbitration after suit — and ask which two this file used, and why.
- Teach non-binding and binding in plain words before any question is asked: both sides must agree, nobody is forced to settle; the decision is final and enforced like a court order. A trainee who can't say those two sentences cleanly will say something worse to John Doe.
- Pre-filing arbitration is the one most trainees have never met. Give them the three places it comes from — rideshare terms, a treatment consent, a nursing-home contract — and say plainly that a clause can close the courthouse door, and that whether it applies here is Atty. Thorne's call.
- Open with the two neutrals' names side by side and ask what each can do to John Doe's case. Hon. Carla Benton (Ret.) can't decide it; any deal needs his agreement through Atty. Thorne; Laura Whitcomb, Esq. can decide it.
- Ask the room: “The mediation was court-ordered. Did John Doe have to settle?” Draw out the answer: ordered to attend, never to agree.
- Watch for trainees who treat logistics as clerical. The private room, the 2-hour buffer and the interpreter check are what let Atty. Thorne and John Doe think clearly in a session where nobody else may speak for them.
- Read the Golden Rule aloud, then the bill script. Violating UPL rules puts both the Case Manager and the firm at risk; say it in those words.

---

### 4.1.10 The Mediation Binder & Exhibit Indexing

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Binder Assembly Verification (`d4m3`)  
> **Topic:** Six sections, one master index, and the five-second rule  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#6` Preparing Mediation Binders: Organized Case Summaries · `D4#7` Mediation Binder Section 1: Executive Summary & Administrative Details · `D4#8` Mediation Binder Section 2: The Mediation Briefs · `D4#9` Mediation Binder Section 3: Core Pleadings (The Legal Framework) · `D4#10` Mediation Binder Section 4: Key Evidence & Liability Exhibits · `D4#11` Mediation Binder Section 5: Damages, Financials & Expert Reports · `D4#12` Mediation Binder Section 6: Settlement History & Draft Agreements · `D4#13` Mediation: Quality Assurance & Logistics Auditor · Newly authored: exhibit numbering, Bates ranges and the master index as the one source of truth

#### 1 · Visual Layout Description

An open binder seen from above fills the left two-thirds: six navy divider tabs stepped down its right edge, each with an orange numbered badge ①–⑥ and its section name, and beside each tab a cream card listing this file's documents as mono pills (RPD-26-018842 · EDR · MRI 03/13/2026 · $16,401.40). Across the top runs a slim navy bar, MASTER INDEX — ONE SOURCE OF TRUTH, with column chips Exhibit · Bates · Source · Status and thin orange leader lines running from index rows down into the tabs. Right third: a large stopwatch chip, 5 SECONDS, above a red danger callout: “Drafts and superseded pleadings never enter the binder.” The leader lines run from the index into the binder, never back: that is the argument.

#### 2 · Slide Body — Tell Them

*Why:* Keystone's stonewall on the 14-Day Gap is why John Doe's file is in suit. At the 03/18/2027 mediation Atty. Thorne will have minutes to answer it, so every record, figure and quote must sit in a known place. A binder he must hunt through costs momentum, and can cost a concession.

1. The Mediation Binder is Atty. Thorne's and the mediator's road map: critical records, verified Specials and liability exhibits, indexed and bookmarked so any one is found in five seconds.
2. Six numbered sections in fixed order, each tab matching the master index. Each document sits in one section; others cite its exhibit number.
3. One master index in the CMS is the single source of truth: section, exhibit number, description, date, source, Bates range and status for each document. The binder prints from the index, never the reverse.
4. Exhibit numbers belong to the proceeding (4-1, 4-2…): a late document takes the next number; a set others hold is never renumbered. Bates numbers belong to the page: stamped once at production (DOE 000001).
5. Section 3 holds only the operative pleadings (09/24/2026 complaint, 11/12/2026 answer), no drafts. The answer pleads comparative negligence (out of turn, unbelted), causation (the gap, a “degenerative” MRI) and failure to mitigate; a defense argued but never pleaded is flagged to Atty. Thorne.
6. Section 5's ledger ties line by line to the certified invoices and HR letter, each correction documented (duplicate removed: $6,290.00 → $6,105.00): $14,817.40 medical + $1,584.00 wages = $16,401.40. Future care ($3,400–$6,800) is narrative.
7. Section 6's log fixes the baseline (Keystone's $3,500, “final” 08/12/2026). A draft Limited Release lets Atty. Thorne fix terms in writing before anyone leaves, conditioned on both UM carriers' written consent (each may substitute its own check to keep subrogation). Its scope (BI only: John Doe pleads no PD claim) is his call.
8. You are the QA and logistics auditor: sets for Atty. Thorne, the mediator and John Doe (or one digital set), every PDF OCR-searchable, statement delivered by 03/11/2027, binder audited against the index 48 hours out.

> ⚠️ **UPL boundary.** You build the binder and draft the confidential statement for Atty. Thorne's approval. Arguments, settlement positions, every number and each set's contents are his. You never discuss value with the mediator, Atty. Mercer or John Doe.

#### 2 · Slide Body — Show Them

*John Doe's six-section Mediation Binder, and each section's QA rule*

| Section | On this file | QA rule |
|---|---|---|
| 1 · Executive summary & administration | Snapshot sheet; mediation order; 03/18/2027, Hon. Carla Benton (Ret.) | Fee split from the order; contacts current |
| 2 · Briefs | Our confidential statement; the defense's, if exchanged | Ours to the mediator only, by 03/11/2027 |
| 3 · Core pleadings | Complaint 09/24/2026; answer and defenses 11/12/2026 | Operative versions only |
| 4 · Key evidence & liability | RPD-26-018842, Ruth Calloway, doorbell stills, EMS report, EDR, deposition summary | Summary + highlighted transcript pages |
| 5 · Damages, financials & experts | Ledger, Northgate HR letter, MRI, Causation Letter, Gap Explanation Record | Ledger = sources: $16,401.40 |
| 6 · Settlement history & drafts | Negotiation Log from 07/20/2026; draft release (Smith, Keystone) | Baseline stated; scope and UM consents flagged for Atty. Thorne |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Mediation set for 03/18/2027 | Open the master index and seat each document in one section | CMS → Documents → Master index | Every entry has section, exhibit number, Bates range and source |
| Pleadings and evidence indexed | Check each defense pleaded in the answer against Sections 4 and 5 | CMS → Litigation → Pleadings Log | Each pleaded defense has an answering exhibit, or a flag to Atty. Thorne |
| Binder assembled | OCR, bookmark and QA against the index; route for approval | CMS → Documents → Mediation Binder | Text-searchable; approved, then delivered by 03/11/2027 |

**Best practices & pitfalls**

- Start from the 07/20/2026 Demand Package: most of Sections 4 and 5 already exist there.
- Bookmark to the page Atty. Thorne will quote, not to the document's cover.
- ⚠️ Pitfall: handing the attorney an unorganized file the morning of the session.
- ⚠️ Pitfall: a snapshot sheet with stale opposing-counsel contacts.
- ⚠️ Pitfall: sending the confidential statement ten minutes before the session, or to the wrong recipient.

#### 3 · Knowledge Check & CM Summary

Verified in Binder Assembly Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Section order and contents | Six sections in order, each with this file's documents |
| 🤖 AI | **20%** | Indexing rules | Exhibit numbers per proceeding, Bates stamped once, master index fields, one source of truth |
| 🤖 AI | **20%** | Figures and dates | $14,817.40 + $1,584.00 = $16,401.40; pleadings 09/24/2026 and 11/12/2026; delivery 03/11/2027; session 03/18/2027 |
| 🧑‍🏫 Trainer | **25%** | Purpose over procedure | Explains how an indexed binder protects Atty. Thorne's position in the room, not just how it is filed |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Arguments, positions and numbers left to Atty. Thorne; the statement kept confidential to the mediator |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with a question: “What happens if Atty. Thorne gets an unorganized file the morning of the mediation?” Let the room answer, then say it plainly: he loses momentum, looks unprepared in front of the mediator, and may concede a point because he couldn't find the proof in time.
- Ask the room: “Where do you find the mediator's fee split?” The answer is the mediation order or the parties' stipulation, read, not assumed. Many orders split the fee 50/50; this file's order says what it says.
- Spend real time on the index. Trainees treat the binder as the product; the product is the index, and the binder is printed from it. When two copies disagree, the index decides.
- Section 3 is a legal check run by an operational person: the CM flags an unpled argument, Atty. Thorne decides whether to object. On this file all three defenses were pleaded, so Sections 4 and 5 must answer each one. In Section 5: Dr. Reyes's causation opinion, and any other treating physician's, may itself have to be disclosed by 03/15/2027 under the court's rules. Flag it to Atty. Thorne now (03/04/2027) with the deadline; whether and how each treating physician is disclosed, and whether a retained expert is added, is his call.

---

### 4.1.11 Arbitration Exhibits & Evidentiary Rules

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Binder Assembly Verification (`d4m3`)  
> **Topic:** From a binder that persuades to the record a binding award rests on  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#21` Arbitration Binders: Section 1 — The Arbitration Submissions · `D4#22` Arbitration Binders: Section 2 — Core Litigation Pleadings · `D4#23` Arbitration Binders: Section 3 — Liabilities & Biomechanical Evidence · `D4#24` Arbitration Binders: Section 4 — Proving Bodily Accident Medical Damages · `D4#25` Arbitration Binders: Section 5 — The Prior Medical Shield · `D4#26` Arbitration Binders: Section 6 — Economic Losses & Lien Reconciliations · Newly authored: authentication, business-records certifications, relaxed evidence rules in arbitration, and mediation confidentiality at the hand-off

#### 1 · Visual Layout Description

Two panels joined by a heavy orange arrow labelled THE GAP DISPUTE CARRIES OVER. Left, small and greyed: the Mediation Binder, captioned PERSUADES · NON-BINDING. Right, dominant: six navy tabs ①–⑥ with orange badges, each above a cream card stating its QC rule in one line. Over Tab 1, an orange-outlined THRESHOLD chip: BI EXHAUSTED · $10,000 TENDERED 03/18/2027. Beneath the tabs, an AUTHENTICATION rail of three mono pills: CUSTODIAN CERTIFICATION · NATIVE FILE · CHAIN OF CUSTODY. Bottom-right, a red danger callout: “Not exchanged by 06/02/2027 → may not count.” Beside it, a grey chip: CONFIRM THE FORUM'S RULES. The difference in size between the panels is the argument: this record decides.

#### 2 · Slide Body — Tell Them

*Why:* On 04/05/2027 Harbor Point and Cardinal State took up Keystone's gap argument; Laura Whitcomb, Esq. will decide damages, bindingly. An Arbitration Binder is the record the award rests on: a page missing, illegible or not exchanged by 06/02/2027 may not count.

1. Mediation is non-binding; its binder persuades. A binding award rests on the exhibits, and court review is very limited (some UM clauses allow a trial de novo; confirm the clause and statute). Apply each tab's QC rule as documents are sorted.
2. The threshold leads: UM opens only because BI is exhausted. Prove it with the executed documents (Keystone's $10,000 tender, the UM consents, the Limited Release, Robert Smith's dismissal), never the Mediation Statement.
3. Authenticate every exhibit: show it is what it claims to be. Get each custodian's business-records certification covering every date exhibited: each provider, Riverton Fire (EMS), Riverton PD, Northgate HR. A causation opinion is not a business record. Confirm the forum's rule.
4. Keep video and data native and unaltered, with a chain-of-custody log (doorbell copy secured 02/19/2026). Print stills in color; QC rejects grayscale.
5. Many arbitration rules relax the formal rules of evidence: the arbitrator admits what is relevant and weighs it. Confirm the forum's rules, then build to the strict standard anyway. Admitted is not persuasive.
6. Number claimant exhibits C-1 onward across the tabs, keep the production Bates numbers, and freeze the set once exchanged.
7. Nothing from the confidential mediation crosses over: not our statement, not its offers. Mediation communications are typically confidential and inadmissible; confirm the governing rule.
8. Liens and health-plan payments are generally collateral sources kept from the factfinder; whether paid or billed amounts are the measure, and whether either reaches the arbitrator, varies. The Lien Sheet and the negotiation ledger (offers of compromise) stay in Atty. Thorne's set. Confirm the governing rule.

> ⚠️ **UPL boundary.** You assemble, index, confirm completeness and audit. Atty. Thorne decides what is argued, what is exchanged, what is withheld as privileged and whether an expert is retained. You never argue an exhibit to Laura Whitcomb, Esq. or the carriers.

#### 2 · Slide Body — Show Them

*The UM Arbitration Binder's six tabs, and each tab's QC rule*

| Tab | On John Doe's file | QC rule |
|---|---|---|
| 1 · Submissions | BI exhaustion record; snapshot sheet; final brief; fee disclosures | Retainers paid; final brief |
| 2 · Arbitration pleadings | Demand; Cardinal State's joinder; each carrier's 04/05/2027 position; any Scheduling Order | Operative versions only |
| 3 · Liability & biomechanics | Certified RPD-26-018842; doorbell stills; event data recorder | Identifiers redacted per forum; citation's use: Atty. Thorne; color |
| 4 · Medical damages | Treatment chart; ledger $14,817.40; provider records and bills; MRI 03/13/2026; Dr. Reyes's orders and Causation Letter | Ledger = certified invoices |
| 5 · Prior medical shield | 2021 chiropractic: three low-back visits, resolved; no prior neck complaint; work history | Paired with the MRI read and a medical opinion |
| 6 · Economic losses | Northgate HR letter ($1,584.00) | Wage proof only |
| Attorney's set — not for exchange | Audited Lien Sheet; negotiation ledger; tort complaint and answer | Atty. Thorne decides |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Arbitration invoked 04/05/2027 | Open the claimant exhibit index and calendar the exchange and the brief | CMS → Litigation → Exhibit index · Docket System | 06/02/2027 exchange and 06/11/2027 brief on the calendar |
| Provider records gathered | Request each custodian's business-records certification | Medical Records Requests | One certification per provider covering every date exhibited |
| Exchange set assembled | Route the set and every flagged item to Atty. Thorne | CMS → Tasks → Escalate | Approved before 06/02/2027; no privileged item in the set |

**Best practices & pitfalls**

- Build to the strict evidence standard even where the forum relaxes it.
- Keep native video and data files untouched; work from copies.
- Request certifications the week the arbitration is invoked; custodians are slow.
- ⚠️ Pitfall: a grayscale print of a crash still.
- ⚠️ Pitfall: a draft brief or a superseded complaint in the exchanged set.
- ⚠️ Pitfall: the Confidential Mediation Statement carried into the Arbitration Binder.

#### 3 · Knowledge Check & CM Summary

Verified in Binder Assembly Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Tab order and contents | Six tabs in order with this file's documents; the BI exhaustion record leads |
| 🤖 AI | **20%** | QC rules | Retainer paid, operative arbitration pleadings, redaction, color, ledger = invoices, prior record paired, wage proof only |
| 🤖 AI | **20%** | Evidentiary basics | Authentication, business-records certification, chain of custody, “confirm the forum's rules” |
| 🧑‍🏫 Trainer | **20%** | Mediation vs. arbitration | Explains why the arbitration record is less forgiving than the Mediation Binder |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | Exchange, privilege and argument left to Atty. Thorne; no argument to the arbitrator or the carriers |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open by holding up the Mediation Binder: “This one persuaded. The next one is evidence.” Then write 06/02/2027 on the board; everything in this lesson counts back from the exchange.
- Ask the room: “Who can say the doorbell video is what we say it is?” Let them reach Margaret Doe as the camera's owner, the 02/19/2026 copy and the chain of custody. Whether anyone testifies is Atty. Thorne's decision.
- Relaxed evidence rules are where trainees get careless. Make them say it back: relaxed admission is not full weight, and the clause may relax nothing at all. Confirm the forum's rules.
- Hold the privilege line. The CM flags; Atty. Thorne decides. An internal memo in an exchanged set cannot be unsent.

---

### 4.1.12 The Prior Medical Shield: Answering the Pre-Existing-Condition Defense from the Record

> **Lesson** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Binder Assembly Verification (`d4m3`)  
> **Topic:** Tab 5: the 2021 baseline, laid beside the injury, before the carriers raise it  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#25` Arbitration Binders: Section 5 — The Prior Medical Shield · `D4#27` Skill Building: The PI Critical Thinking Audit Challenge (Arbitration) · `D4#30` Common Bottlenecks: Arbitration (The Trial-Ready Landmines) · `D1#33` Case Planning — Treatment: The Assessment Phase · `D1#46` Skill Building: The “Eggshell Plaintiff” vs. the 2018 Lumbar Strain · `D2#7` Master Audit Checklist: Medical & Billing Audit · Newly authored: the five-component shield on this file, the body-region side-by-side, the consistency audit and the harm-to-timeline check

#### 1 · Visual Layout Description

A split comparison board titled TAB 5 · THE PRIOR MEDICAL SHIELD. Left column, small and in greyed cream: 2021 · BIRCH AVENUE CHIROPRACTIC, a spine silhouette with only the lower back tinted, three mono date pills 05/04 · 05/11 · 05/18/2021, and a green stamp RESOLVED · RELEASED TO FULL ACTIVITY. Right column, larger and navy: SINCE 02/06/2026, the same silhouette with the neck tinted orange and labelled C5-C6 RIGHT PARACENTRAL, above two cream cards: MRI 03/13/2026 · DR. HELEN PARK quoting “no significant degenerative change at the adjacent levels”, and CAUSATION LETTER 06/19/2026 · DR. ALANA REYES. Between the columns, a horizontal bar labelled SYMPTOM-FREE INTERVAL running from 05/18/2021 to 02/06/2026, with a NORTHGATE · 01/12/2026 chip near its end. Across the top, three red defense chips, each struck through by an orange arrow to its answer: PRE-EXISTING → A DIFFERENT REGION · DEGENERATIVE → DR. PARK'S READ · CONTINUATION → RESOLVED IN 2021. Bottom-right, a grey routing card: ATTY. THORNE ARGUES · DECIDES ON A DECLARATION. The argument: every defense move is answered by a document, never by an adjective.

#### 2 · Slide Body — Tell Them

*Why:* The defense line on John Doe's file has always been “it was already there”: Keystone called the MRI “degenerative” on 08/05/2026, the 11/12/2026 Answer pleads causation on it, and defense counsel worked the 2021 low-back visits at the 02/18/2027 deposition. Harbor Point and Cardinal State now dispute damages, and Laura Whitcomb, Esq. decides bindingly on 06/22/2027. If Tab 5 does not answer the prior from the record, nothing after the award can.

1. Disclose the prior; never hide it. Defense counsel worked the three 2021 low-back visits at the 02/18/2027 deposition, so the arbitrator should meet them first in Tab 5, already distinguished. A prior the other side introduces looks concealed.
2. Know the defense's moves: a pre-existing condition, “degenerative” imaging, the current injury as a continuation of the old one, and often “no baseline pre-accident imaging”. Each move needs its own answering document in Tab 5.
3. Component 1, the complete prior chart: request Birch Avenue Chiropractic's (Dr. Lena Ford, DC) full records for 05/04, 05/11 and 05/18/2021 (intake form, every visit note, any imaging, the discharge) with a business-records certification covering each date. Never a summary, and never John Doe's recollection.
4. Component 2, resolution: show from the chart how many visits, when care ended and how: three visits, the last on 05/18/2021, low-back stiffness resolved, released to full activity. Use the record's words, not yours.
5. Component 3, the body region: lay the 2021 complaint beside the injury since 02/06/2026, line by line (region, complaint, imaging, outcome): low back then; neck and right arm now, a C5-C6 right paracentral herniation. Whether any 2021 imaging exists, the certified chart answers; never assume it.
6. Component 4, the symptom-free interval (05/18/2021 to 02/06/2026): prove it with records, not adjectives: the release to full activity, his work (Northgate warehouse shift lead, 8-hour shifts, from 01/12/2026) and every post-collision history recording no prior neck complaint. A hole in the proof is flagged, never filled.
7. Component 5, pair the prior with the current medicine in the same tab: Dr. Helen Park's 03/13/2026 MRI read, “no significant degenerative change at the adjacent levels”, and Dr. Alana Reyes's Causation Letter (06/19/2026). If the letter is silent on the 2021 visits, flag it: a supplemental declaration or a retained expert is Atty. Thorne's decision.
8. Run a consistency audit: every provider intake form and history (Riverton Urgent Care, Riverton Spine & Rehab, Lakeside Orthopedics, Crescent Pain & Spine), the deposition testimony and the 2021 chart must tell the same prior history. Flag any mismatch to Atty. Thorne with both records attached; never correct a record or ask John Doe to. The firm's own intake questionnaire is a privileged source, never an exhibit.
9. Check every claimed harm against the dated medical timeline before the brief is docketed (06/11/2027): each element of damages, such as the residual intermittent right-arm paresthesia recorded at MMI on 06/12/2026, must point to a dated record. A harm with no record is flagged, not argued.
10. Time it: request the prior chart and its certification the week arbitration is invoked (04/05/2027), and red-flag any shield piece still open 10 days before the 06/02/2027 exchange.

> ⚠️ **UPL boundary.** You request, certify, compare, index and flag. You never write that the injury is new, “not degenerative” or an aggravation, never interpret the MRI, and never tell John Doe or a carrier what the 2021 visits mean for his claim. The eggshell and aggravation arguments, and any expert or declaration, are Atty. Thorne's; medical opinions are the providers'.

#### 2 · Slide Body — Show Them

*Tab 5's side-by-side: the 2021 baseline against the injury since 02/06/2026, every cell from a certified record*

|  | Before: 2021 | Since 02/06/2026 |
|---|---|---|
| Provider | Birch Avenue Chiropractic, Dr. Lena Ford, DC | Riverton Fire EMS; Riverton Urgent Care; Riverton Spine & Rehab; Lakeside Orthopedics; Summit Imaging Center; Crescent Pain & Spine |
| Dates | Three visits: 05/04, 05/11 and 05/18/2021 | Neck complaint on the date of loss (EMS); first treatment 02/20/2026 |
| Region | Low back | Neck (cervical) and right arm |
| Complaint and finding | Low-back stiffness | Cervical strain; C5-C6 right paracentral herniation; right-hand numbness from 02/18/2026 |
| Imaging | Whatever the certified chart shows; never assumed | MRI 03/13/2026, Dr. Helen Park: “no significant degenerative change at the adjacent levels” |
| Outcome | Resolved; released to full activity | MMI 06/12/2026; residual intermittent right-arm paresthesia |
| Proof in Tab 5 | The complete chart, certified for every date | Certified records; Dr. Reyes's Causation Letter (06/19/2026); a declaration only if Atty. Thorne directs |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Arbitration invoked 04/05/2027 | Request Birch Avenue Chiropractic's complete 2021 chart with a business-records certification | Medical Records Requests | Full chart for 05/04, 05/11 and 05/18/2021, certified; not a summary |
| Prior chart received | Build the side-by-side comparison from the certified records, quoting their words | CMS → Litigation → Exhibit index | Every cell cites a record and page |
| A history mismatch, or a Causation Letter silent on 2021 | Flag it to Atty. Thorne with the records attached; he decides on a supplemental declaration | CMS → Tasks → Escalate | Flag dated; no record or testimony altered |
| Tab 5 assembled | Check every claimed harm against the dated treatment timeline; route the tab for approval | CMS → Case File → Treatment timeline | Approved before the 06/02/2027 exchange |

**Best practices & pitfalls**

- Put the prior in your own binder first, already distinguished.
- Name the body region in every line: the 2021 visits were low back; everything since 02/06/2026 is neck and right arm.
- Use the records' own words (“resolved”, “released to full activity”, “no significant degenerative change at the adjacent levels”), never adjectives.
- Proofread laterality and levels: right side, C5-C6. One slip in Tab 5 hands the carriers a credibility point.
- ⚠️ Pitfall: leaving the prior out and letting the carriers introduce it.
- ⚠️ Pitfall: writing “not pre-existing” or “not degenerative” in your own summary; that is a medical opinion and Atty. Thorne's argument.
- ⚠️ Pitfall: a summary, or John Doe's memory of 2021, in place of the certified chart.
- ⚠️ Pitfall: correcting a conflicting history instead of flagging it.

#### 3 · Knowledge Check & CM Summary

Verified in Binder Assembly Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **10%** | Defense theory named | Pre-existing, “degenerative” imaging, continuation and the no-baseline-imaging line, each matched to an answering document |
| 🤖 AI | **25%** | Five shield components | Certified 2021 chart for every date; resolution; low back vs. neck side-by-side; the interval proved by records; Dr. Park's read and the Causation Letter paired |
| 🤖 AI | **15%** | Consistency and timeline audit | Every history and the deposition checked against the 2021 chart; every claimed harm tied to a dated record; mismatches flagged, not fixed |
| 🤖 AI | **10%** | Timing | Requests the week of 04/05/2027; open pieces red-flagged before the 06/02/2027 exchange |
| 🧑‍🏫 Trainer | **20%** | Disclose and distinguish | Explains why the prior goes in Tab 5 rather than being left for the carriers to introduce |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | No causation, degeneration or aggravation opinion; the declaration and the argument left to Atty. Thorne |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the defense's one sentence: “It was already there.” Then ask who on this file has already said it, and when: Keystone on 08/05/2026, the Answer on 11/12/2026, defense counsel at the 02/18/2027 deposition.
- Draw the two columns on the board and let the room fill them from the case file. The point lands when they write “low back” on the left and “neck and right arm” on the right.
- Watch for trainees who write “not degenerative” in their own words. Make them replace it with Dr. Park's sentence, in quotation marks, with the date of the read.
- The eggshell rule (generally, the defendant takes the plaintiff as he finds him; an aggravation is compensable) is Atty. Thorne's to argue, and the governing rule must be confirmed. The Case Manager's work is the record both arguments rest on.

---

### 4.1.13 Health Subrogation & Statutory Lien Reduction Lab

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Skill Activity 1 — reduce Peach State, clear the statutory side  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#18` Lien Negotiations/Reduction: Common Types of Liens · `D3#19` Key Legal Doctrines Used for Reduction · `D2#40` Finalized Settlement: Final Lien Mitigation (The “Reduction”) · `D2#35` The Execution: Lien Payoff Letters (The “Verification” Paperwork)

#### 1 · Visual Layout Description

A two-panel lab bench. Left panel: a white CMS Lien Tracker card with a navy header bar and one live row, PEACH STATE · $1,860.00 → $1,240.00, with the arithmetic beneath in mono ($1,860.00 × ⅓ = $620.00), and hollow rows below it each stamped with a green ✓ NONE — VERIFIED and a small source chip (BCRC · MEDICAID VERIFIED · HARBOR POINT 03/02/2026 · INTAKE). Right panel: a draft letter on cream paper headed REDUCTION REQUEST — FOR ATTY. THORNE'S SIGNATURE, a red HOLD tag across its corner. Between the panels an orange arrow labelled ESCALATE runs to a navy chip: ATTY. ELIJAH THORNE · GOVERNING LAW · DOCTRINE. The argument: the Case Manager builds the request; counsel releases it.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 10/06/2026. Cardinal State has tendered its $10,000 limits: gross $40,000.00. Both liens have been on the Lien Tracker (the CMS → Liens record from Day 2, shown on the Net Sheet) since the pre-demand audit and were kept current through the UM negotiation; Atty. Thorne held Reduction Requests until the gross was known. Peach State Health Plan asserts $1,860.00, its contract-rate payment for the 05/15/2026 epidural injection at Crescent Pain & Spine. The plan documents show a fully insured group plan.

**Execution prompt.** Work Peach State's claim and the statutory clearance in the Lien Tracker. Match the plan's itemized payments to the treatment record, classify the lien, record its funding status and escalate the governing-law question to Atty. Thorne. Draft the Reduction Request for his signature: name the doctrine, show the one-third math to $1,240.00, cite the work that built the fund (the 14-Day Gap defense beaten with the MRI) and flag made whole as his to argue. Record every absent claimant as a verified none with its source. The graded call: what you hold until he approves, and what makes the 10/09/2026 acceptance final.

| | |
|---|---|
| **Tool / interface** | CMS → Financial Ledger → Net Sheet → Lien Tracker · CMS → Documents → Outgoing · CMS → Tasks → Escalate |
| **Expected output** | A Peach State Reduction Request ready for Atty. Thorne's signature, a Lien Tracker with every absent claimant cleared and sourced, and the 10/09/2026 acceptance recorded at $1,240.00 once confirmed in writing. |

**Show Them — reference model**

*The Reduction Request, built for Atty. Thorne*

1. **Match** — Plan ledger to the treatment record: one charge, 05/15/2026, $1,860.00 paid.
2. **Classify** — Contractual reimbursement; fully insured plan; governing law to Atty. Thorne.
3. **Calculate** — $1,860.00 × ⅓ = $620.00 → $1,240.00.
4. **Clear** — Medicare, Medicaid, hospital, workers' comp, PIP: none; prior attorney: none known. Each sourced.
5. **Hold, then confirm** — Sent on his approval; final on the plan's written acceptance.

**Verification checkpoints**

- [ ] Plan ledger matched to one accident-related charge: the 05/15/2026 injection, $3,400.00 billed, $1,860.00 paid; the lien is what the plan paid, not what was billed
- [ ] Crescent Pain & Spine's $1,540.00 write-off ($3,400.00 – $1,860.00) recorded as not owed: contract rate, no balance billing
- [ ] Lien classified as a contractual health-plan reimbursement, not statutory; fully insured status recorded from the plan documents
- [ ] Governing law (state law, not ERISA preemption) recorded as Atty. Thorne's determination, not the Case Manager's
- [ ] Common-fund math shown: $1,860.00 × ⅓ = $620.00; $1,860.00 – $620.00 = $1,240.00; the request cites the MRI and Dr. Reyes's 06/19/2026 Causation Letter that beat the gap defense
- [ ] Made whole flagged for Atty. Thorne; comparative fault recorded as not applicable (no fault reduction on Track A)
- [ ] Request held in Documents → Outgoing until Atty. Thorne's written approval is logged
- [ ] Medicare recorded as none, citing the Day 2 check (34, not on SSDI), so no MSPRP final demand to reconcile; Medicaid recorded as none, verified separately with John Doe (the BCRC answers for Medicare only)
- [ ] Hospital and workers' comp each “none — verified” with date and source; prior attorney “none known to John Doe” with date and source; PIP recorded as not a lien: Harbor Point asserted no reimbursement right against John Doe (03/02/2026); whether it reserves PIP subrogation against Robert Smith asked in writing and routed to Atty. Thorne, no outcome recorded
- [ ] PIP-paid providers (Riverton Urgent Care, Lakeside Orthopedics, Summit Imaging) at a zero balance; Summit's 03/11/2026 LOP request was declined, so it holds no lien
- [ ] Acceptance logged 10/09/2026 at $1,240.00 only with Peach State's written confirmation and Atty. Thorne's approval attached

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Peach State's itemized ledger received | Match each payment to the treatment record | Medical Records Requests · CMS → Financial Ledger → Net Sheet → Lien Tracker | One line, 05/15/2026, $1,860.00, accident-related |
| Reduction Request drafted | Route to Atty. Thorne for approval and signature | CMS → Tasks → Escalate | Nothing sent before his written approval is logged |
| Plan's written acceptance arrives | Record the reduced figure and attach the confirmation | CMS → Financial Ledger → Net Sheet → Lien Tracker | $1,240.00 dated 10/09/2026; confirmation attached |

**Best practices & pitfalls**

- Audit the Health Plan's claim too: a plan's ledger can carry charges unrelated to the collision.
- Record the absent liens with the same care as the present ones. Had Medicare paid, the file would stay pended until its final demand arrived (it can take 60 days or more) and was reconciled to the ledger.
- ⚠️ Pitfall: sending a request that argues a doctrine Atty. Thorne has not chosen.
- ⚠️ Pitfall: logging a verbal “we'll take a third off” as a final figure.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Reduction math | $1,860.00 × ⅓ = $620.00; reduced to $1,240.00 |
| 🤖 AI | **15%** | Clearance of absent claimants | Medicare, Medicaid (sourced separately), hospital, workers' comp, prior attorney, PIP and the PIP-paid providers each recorded with a source |
| 🤖 AI | **15%** | Classification and audit | Contractual and fully insured; one accident-related charge matched; the $1,540.00 write-off not owed |
| 🤖 AI | **10%** | Dates and confirmation | Acceptance dated 10/09/2026 with the written confirmation attached |
| 🧑‍🏫 Trainer | **20%** | Doctrine judgment | Frames common fund and made whole for Atty. Thorne without choosing between them |
| 🧑‍🏫 Trainer | **20%** | Authority boundary | Nothing sent, offered or accepted before Atty. Thorne's written approval |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open on the plan documents: “What one fact about Peach State decides which law governs its claim?” Funding. Fully insured, not self-funded.
- Ask: “Who decides whether John Doe was made whole?” Atty. Thorne. A request that argues it without him is a UPL problem, not a drafting choice.
- Grade the absences. A Lien Tracker that lists two liens and nothing else is incomplete; every absent claimant recorded as a verified “none” with its source is what makes disbursement safe. Ask who checked Summit Imaging, which asked for an LOP on 03/11/2026.
- The math is simple on purpose. What trips trainees is logging $1,240.00 as final before the plan's written confirmation and Atty. Thorne's approval.

---

### 4.1.14 Provider Balance Negotiation Exercises

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Skill Activity 2 — the reduction call to the chiropractor  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#21` Increasing the Client's Net · `D3#22` Auditing the Billing Before Asking for a Discount · `D2#40` Finalized Settlement: Final Lien Mitigation (The “Reduction”) · `D2#35` The Execution: Lien Payoff Letters (The “Verification” Paperwork)

#### 1 · Visual Layout Description

A phone-call storyboard in three frames across the slide, each a cream card with an orange numbered badge. ① THE AUDIT: a mini ledger of 34 lines with the 05/04/2026 line struck through in red, $6,290.00 → $6,105.00 in mono. ② THE CALL: a navy speech-bubble pair, CM and RIVERTON BILLING, with a small written-request chip clipped to the CM's bubble. ③ IN WRITING: a signed Payoff Letter with FULL AND FINAL SATISFACTION highlighted in orange and a green ✓ at $4,580.00 · 10/12/2026. Under frame ② a red danger callout: “A yes on the phone is not a reduction.” Bottom right, the net as a mono pill: $20,359.92.

#### 2 · Slide Body — the scenario and the task

**Scenario.** It is 10/09/2026. Peach State has accepted $1,240.00 in writing. Riverton Spine & Rehab's final LOP ledger shows 34 lines × $185.00 = $6,290.00 for chiropractic and PT 02/24–06/05/2026. Atty. Thorne has set a target for Riverton in writing; the Reduction Request is yours to draft for his approval. No lien can be paid until it is resolved in writing.

**Execution prompt.** Audit Riverton Spine & Rehab's ledger against the visit records and request a written correction before asking for anything. Draft the Reduction Request for Atty. Thorne's approval, send it once approved, then make the follow-up call to the billing manager in the Call Simulator inside his written authority: state the audited balance, the coverage-capped recovery and the math, and ask for payment in full in the interest of global resolution. The manager agrees to $4,580.00 on the call. The graded call: what you say next, and what must exist before that figure is final and the Net Sheet shows $20,359.92.

| | |
|---|---|
| **Tool / interface** | Call Simulator → AI Billing Manager: Riverton Spine & Rehab · Email Workspace · CMS → Financial Ledger → Net Sheet → Lien Tracker |
| **Expected output** | An audited Riverton balance of $6,105.00, an approved written request and a logged call, a signed Payoff Letter accepting $4,580.00 dated 10/12/2026, and a recomputed Net Sheet. |

**Verification checkpoints**

- [ ] Ledger audited line by line: 34 billed lines against 33 documented visits (16 from 02/24 to 04/02/2026, 17 from 04/21 to 06/05/2026)
- [ ] The 05/04/2026 duplicate, removed from the Specials in the pre-demand audit, is still on Riverton's Final Ledger: written correction requested before any reduction: $6,290.00 – $185.00 = $6,105.00
- [ ] Each line's code matched to that day's note, upcoding and unbundling checked and recorded; no line in the 04/02 → 04/21/2026 disruption (missed 04/03, 04/07, 04/09, 04/14)
- [ ] Written Reduction Request approved by Atty. Thorne and sent before the call; his target and authority logged
- [ ] Argument on true facts: a recovery capped at $40,000 of coverage, fee and costs paid from it; no claim that Riverton would take only a share, or that the client will refuse the settlement
- [ ] Ask framed as payment in full in the interest of global resolution; no payment promised
- [ ] $4,580.00 not accepted on the call: the trainee says it goes to Atty. Thorne and will be confirmed in writing
- [ ] Signed Payoff Letter on file: $4,580.00 accepted as full and final satisfaction of the LOP; no balance billing or collections against John Doe
- [ ] Lien Tracker: $6,290.00 billed → $6,105.00 audited → $4,580.00 accepted 10/12/2026 ($185.00 corrected + $1,525.00 negotiated = $1,710.00 saved)
- [ ] Net Sheet recomputed: $40,000.00 – $13,333.33 – $486.75 – $1,240.00 – $4,580.00 = $20,359.92
- [ ] Savings reported to John Doe as facts, with no advice on the settlement

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Final LOP ledger received | Audit it and request the written correction | Medical Records Requests · Email Workspace | $6,105.00 confirmed in writing before any reduction is asked |
| Request approved and sent | Make the follow-up call and log it | Call Simulator → AI Billing Manager: Riverton Spine & Rehab · CMS → Communications Log | Call logged with the ask and the answer; no figure accepted on the call |
| Provider agrees to a figure | Route it for approval, obtain the signed Payoff Letter, update both tabs | CMS → Tasks → Escalate · CMS → Financial Ledger → Net Sheet | Payoff Letter on file; net $20,359.92 |

**Best practices & pitfalls**

- Script the call before you dial: the audited balance, the recovery, the math, the ask.
- Lead with the audit correction; it tells the provider you have read the records.
- ⚠️ Pitfall: agreeing to the figure on the phone because it sounds good.
- ⚠️ Pitfall: a Payoff Letter without the full-and-final and no-balance-billing language.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Audit result | 05/04/2026 duplicate removed; $6,105.00; nothing billed in the disruption |
| 🤖 AI | **20%** | Ledger and net | $6,290.00 → $6,105.00 → $4,580.00; net $20,359.92 |
| 🤖 AI | **10%** | Payoff Letter | Full and final; no balance billing; dated 10/12/2026 |
| 🤖 AI | **10%** | Request and call record | Written request approved before it went; the ask and the answer logged |
| 🧑‍🏫 Trainer | **15%** | Negotiation conduct | Firm, courteous and factual; the argument stated honestly |
| 🧑‍🏫 Trainer | **25%** | Authority boundary | Nothing accepted, promised or confirmed outside Atty. Thorne's authority |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Run it live. One trainee calls; the AI billing manager pushes back: “We gave him 33 visits on a promise of payment, and you want a discount?” The answer is the audit and the true facts of the recovery, not sympathy.
- Ask: “The manager just said yes to $4,580.00. What do you say next?” The right answer thanks them and says the figure goes to Atty. Thorne and will be confirmed in writing.
- Grade the audit first. A trainee who opens with a discount on $6,290.00 has negotiated around $185.00 of error the provider should have simply corrected.
- Tie it forward to the disbursement: the Payoff Letter is what lets the 10/22/2026 disbursement go out clean.

---

### 4.1.15 Completing the Final Dual-Tab Net Sheet

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Final Accounting Check (`d3m4`)  
> **Topic:** Skill Activity 1 — take $40,000.00 to $20,359.92, and prove every line  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#35` The Execution: Lien Payoff Letters (The “Verification” Paperwork) · `D2#36` The Execution: The Settlement Statement (The “Net” Sheet) · `D3#25` The Net Sheet: The LSH Corporate Net Sheet Ledger · `D3#27` Key Takeaway — The Value of a Case Manager · `D3#28` Skill Building: The “Doe v. Apex” Final Net Challenge

#### 1 · Visual Layout Description

Split slide. Left 60%: the Lien Tracker tab as a cream table with mono columns ASSERTED · AUDITED · REDUCED · PAYOFF LETTER. The Riverton Spine & Rehab row reads $6,290.00 → $6,105.00 → $4,580.00, with an orange strike through the 05/04/2026 duplicate; Peach State reads $1,860.00 → $1,860.00 → $1,240.00. Beneath, three grey zero-balance rows (PIP, Crescent, the PIP-paid providers), each with a NOT PAYABLE chip. Right 40%: a navy stream card with two stacked bars, BI 25% and UM 75%, feeding a large orange NET $20,359.92. A red callout at the foot: “No Payoff Letter, no payment.”

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 10/13/2026. Cardinal State's $10,000 check arrived today, joining Keystone's (received 09/04) and Harbor Point's (10/05) in the IOLTA trust account, each deposited only after its release was signed (Keystone 08/28; each UM release before its check): $40,000.00 received; the last check has not cleared. Peach State accepted $1,240.00 on 10/09 and Riverton Spine & Rehab accepted $4,580.00 on 10/12; both written acceptances are in Documents. Costs stand at $486.75. Both Net Sheet tabs are half-built from the demand phase.

**Execution prompt.** Complete John Doe's Net Sheet in both tabs. Recovery Ledger: each check by carrier and stream, the 33⅓% fee per stream, the five receipted costs, and costs and liens split 25% / 75%, down to the net per stream and in total. Lien Tracker: every provider and payer with charges, payments, adjustments and balance owed, then each lien's asserted, audited and reduced figure, the basis of each reduction and its payoff-letter status. Tie both tabs to the Trust Ledger. Graded judgment: what stays off the payables, and what you flag for Atty. Thorne before John signs.

| | |
|---|---|
| **Tool / interface** | CMS → Financial Ledger → Net Sheet (Recovery Ledger · Lien Tracker) |
| **Expected output** | A two-tab Net Sheet that reaches $20,359.92 down both streams and across the total, with every lien figure proved and routed to Atty. Thorne. |

**Verification checkpoints**

- [ ] Gross by check: Keystone $10,000.00 to Stream 1; Harbor Point $20,000.00 + Cardinal State $10,000.00 = $30,000.00 to Stream 2
- [ ] Fee at the pre-suit 33⅓% (no suit filed): $3,333.33 + $10,000.00 = $13,333.33
- [ ] Costs receipted: $25.00 + $214.75 + $72.00 + $25.00 + $150.00 = $486.75, split $121.69 / $365.06 and charged once
- [ ] Liens split 25% / 75%: Peach State $310.00 / $930.00; Riverton Spine & Rehab $1,145.00 / $3,435.00
- [ ] Net both ways: $5,089.98 + $15,269.94 = $20,359.92, and $40,000.00 – $13,333.33 – $486.75 – $1,240.00 – $4,580.00 = $20,359.92
- [ ] Peach State row: asserted $1,860.00, audited $1,860.00 (matches its payment for Crescent's 05/15/2026 injection), reduced $1,240.00 (one-third procurement-cost reduction, $620.00), accepted 10/09/2026
- [ ] Riverton Spine & Rehab row: billed $6,290.00, audited $6,105.00 (duplicate 05/04/2026 line, $185.00), reduced $4,580.00, accepted 10/12/2026
- [ ] Zero-balance lines kept off the payables with their source: PIP $5,000.00 (no reimbursement right, 03/02/2026); Crescent $3,400.00 – $1,860.00 = $1,540.00 written off; Riverton Urgent Care, Lakeside Orthopedics and Summit Imaging paid in full by PIP
- [ ] Payoff status recorded per lien: written figure and date logged, satisfaction of lien marked “to obtain at payment”; no line final on a phone call
- [ ] Future medical ($3,400–$6,800 in possible repeat ESIs) flagged to Atty. Thorne before John Doe signs: the settlement is full and final, and no carrier pays more
- [ ] Ties out: trust deposits $40,000.00 = Recovery Ledger gross; liens audited $1,860.00 + $6,105.00 = $7,965.00, paid $1,240.00 + $4,580.00 = $5,820.00 ($2,145.00 negotiated, plus the $185.00 duplicate removed at audit)

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Last UM check received (10/13/2026) | Post the deposit and complete the Recovery Ledger by stream | CMS → Financial Ledger → Net Sheet → Recovery Ledger | Streams $10,000.00 / $30,000.00; net $20,359.92 |
| Lien reduction accepted in writing | Complete the Lien Tracker row and log the Payoff Letter | CMS → Financial Ledger → Net Sheet → Lien Tracker · CMS → Documents | Peach State $1,240.00 (10/09); Riverton Spine & Rehab $4,580.00 (10/12) |
| Both tabs tie to the Trust Ledger | Route the draft Settlement Statement with the future-medical flag | CMS → Tasks → Escalate | Routed to Atty. Thorne before John Doe sees the statement |

**Best practices & pitfalls**

- Every reduction needs a named basis or an audit finding, written on its line.
- Record zero-balance lines with their source document, so no one later pays what isn't owed.
- Compute the UM share as the remainder of each split so the streams add back to the cent.
- ⚠️ Pitfall: marking a lien final from an email or a phone call instead of a written payoff figure.
- ⚠️ Pitfall: adding PIP's $5,000.00 or Crescent's write-off to the payables and paying John Doe's money away.

#### 3 · Knowledge Check & CM Summary

Verified in Final Accounting Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Stream arithmetic | Fee, costs and liens split correctly; $5,089.98 + $15,269.94 = $20,359.92 |
| 🤖 AI | **15%** | Lien Tracker accuracy | Asserted, audited and reduced figures and dates for Peach State and Riverton Spine & Rehab |
| 🤖 AI | **10%** | Cost verification | Five receipted costs = $486.75, charged once |
| 🤖 AI | **15%** | Zero-balance discipline | PIP, Crescent and the PIP-paid providers kept off the payables with sources |
| 🧑‍🏫 Trainer | **15%** | Judgment on payables | Can explain why each zero-balance line is not owed, citing the document |
| 🧑‍🏫 Trainer | **10%** | Future-care flag | Flags the full-and-final consequence to Atty. Thorne rather than raising it with John Doe |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | No view offered to John Doe on sufficiency, enforceability or acceptance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Start with the zero-balance rows. Ask why PIP's $5,000.00 isn't paid back and why Crescent's write-off isn't owed. A trainee who adds either to the payables has paid John Doe's money away.
- Ask the room: “If Riverton Spine & Rehab had accepted $4,580.00 only on a phone call, could the line be marked final?” No: no Payoff Letter, no payment.
- Grade the arithmetic both ways, down each stream and across the total: $13,333.33 + $486.75 + $1,240.00 + $4,580.00 = $19,640.08, and $40,000.00 – $19,640.08 = $20,359.92. A one-cent drift means a stream was rounded on its own.
- The future-medical flag is the judgment call. Up to $6,800 in possible repeat injections lies ahead, and the settlement is full and final; the CM flags it, and Atty. Thorne has that conversation with John Doe.

---

### 4.1.16 Prior-Attorney Charging Lien: Investigation, Escalation & Settlement Hold

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Final Accounting Check (`d3m4`)  
> **Topic:** Skill Activity 2 — the lien you didn't see coming, worked as evidence  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#20` Quantum Meruit Principle — Prior Attorney Liens · `D2#38` The Execution: W-9 & Comparison of Key Post-Settlement Documents · `D3#29` Case Phase: Disbursement — Core Objectives · Newly authored: the prior-attorney charging lien worked as a factual investigation (signature comparison, engagement timeline, work-product audit, client statement), a temporary administrative hold on the disputed amount, and escalation to the attorney

#### 1 · Visual Layout Description

Centre: Vance & Kettering's notice as a cream letter with a red stamp, CHARGING LIEN · $6,666.67, and beneath it their fee agreement with two signature lines: MARGARET DOE (signed) and JOHN DOE (blank, circled in orange). Left: a vertical timeline in mono pills, 02/09 LSH RETAINED · 07/20 DEMAND SERVED · 07/27 MARGARET SIGNS · 10/14 NOTICE ARRIVES. Right: three evidence cards with orange badges: ① SIGNATURE COMPARISON (RS05 · RS06) ② TIME RECORD 0.6 H ③ NO CARRIER NOTICE. Bottom: a navy CMS strip, TRUST HOLD $6,666.67 · ACTION PLAN UPDATED · DRIVE ARCHIVED, and an arrow to ATTY. THORNE · DECIDES. A red chip by the letter: NO REPLY FROM THE CM. The argument: the Case Manager builds the record; the attorney answers the lawyer.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 10/14/2026 (Wed). $40,000.00 is in trust; both liens are reduced in writing and disbursement is set for 10/22. Vance & Kettering Injury Law emails a notice of attorney's charging lien: retained 07/27/2026, it demands one-half of the fee, $6,666.67, asks the firm to hold the whole settlement, and wants the case manager to confirm the split by 10/16.

**Execution prompt.** Log the notice on receipt and route it to Atty. Thorne the same day; send nothing to Vance & Kettering. On his instruction, place a temporary administrative hold on the disputed $6,666.67 in the CMS and update the Action Plan. Then investigate the facts in the audit workbench: retrieve the fee agreement, compare its signatures with John Doe's, cross-reference its date against the firm's engagement milestones, and audit what work the firm claims against the record. Call John Doe in the Call Simulator to ask, without opinion, whether he ever retained the firm. Deliver an objective evidentiary packet to Atty. Thorne and archive every piece of correspondence in the CMS and Drive.

| | |
|---|---|
| **Tool / interface** | Call Simulator → AI Client: John Doe · CMS → Communications Log · CMS → Financial Ledger → Trust · Action Plan Editor · CMS → Tasks → Escalate |
| **Expected output** | A logged and routed notice, a $6,666.67 hold, an evidentiary packet on Atty. Thorne's desk, and the correspondence archived in the CMS and Drive. |

**Verification checkpoints**

- [ ] Notice logged 10/14/2026 on receipt and routed to Atty. Thorne the same day; nothing sent to Vance & Kettering
- [ ] Hold of $6,666.67 placed in the CMS on Atty. Thorne's instruction; the Action Plan shows the 10/22 disbursement depends on it
- [ ] Signatures compared: the 07/27/2026 agreement is signed only by Margaret Doe; John Doe's 02/09/2026 fee agreement and HIPAA authorization are the exemplars
- [ ] Timeline cross-referenced: LSH engaged 02/09/2026 and served the demand 07/20/2026, before the 07/27 agreement; no discharge or substitution on file
- [ ] Work-product audit: the firm's own record shows 0.6 hours with Margaret Doe; no letter of representation, records, filing or carrier notice
- [ ] John Doe's account recorded in his words from the 10/15/2026 call, with no view on the lien given to him
- [ ] The packet states facts only: unauthorized retention, no client signature, zero work; validity, quantum meruit and any response flagged for Atty. Thorne
- [ ] No fee division confirmed, negotiated or discussed with Vance & Kettering
- [ ] Correspondence archived in CMS → Doc Hub and kept on the Backup Drive; the 10/19/2026 withdrawal and the hold's release logged when they come

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| A notice of charging lien arrives (10/14/2026) | Log it on receipt; route to Atty. Thorne; on his instruction, hold the disputed amount | CMS → Communications Log · CMS → Tasks → Escalate · CMS → Financial Ledger → Trust | Routed the same day; $6,666.67 on hold; nothing sent to the claiming firm |
| Investigation (10/15/2026) | Compare signatures, cross-reference dates, audit the work, take John Doe's account | CMS → Documents · Call Simulator → AI Client: John Doe | Each finding tied to a document on the file |
| Packet delivered | Deliver the evidentiary packet; update the Action Plan; archive everything | CMS → Tasks → Escalate · Action Plan Editor · CMS → Documents | Atty. Thorne repudiates 10/16; withdrawal 10/19; hold released by him |

**Best practices & pitfalls**

- Write the packet so Atty. Thorne could send it unedited: dates, documents, quotations, no adjectives.
- Hold only what Atty. Thorne tells you to hold; the rest of the file keeps moving.
- ⚠️ Pitfall: replying to the claiming lawyer, even to say the claim is baseless.
- ⚠️ Pitfall: telling John Doe his mother's agreement “doesn't count.”

#### 3 · Knowledge Check & CM Summary

Verified in Final Accounting Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Investigation findings | Margaret Doe's signature only; dates after the 02/09 engagement and the 07/20 demand; 0.6 hours; no carrier notice |
| 🤖 AI | **15%** | Hold and records | $6,666.67 held on instruction; Action Plan updated; correspondence in the CMS and Drive |
| 🤖 AI | **20%** | Packet objectivity | Facts only, each sourced; legal questions listed for Atty. Thorne |
| 🧑‍🏫 Trainer | **15%** | Client call | Neutral questions; John Doe's account recorded in his words; no opinion on the lien |
| 🧑‍🏫 Trainer | **25%** | UPL boundary | No contact or negotiation with the claiming firm; no validity call; every decision Atty. Thorne's |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open on the notice and ask: “Who answers Mr. Vance?” Atty. Thorne. The Case Manager logs it, holds the money he says to hold, and builds the record.
- The signature comparison is the moment. Put the 07/27 agreement beside the 02/09 retainer: one signer is Margaret Doe, the other John Doe. Let the room say what it shows, then stop them before they say what it means.
- Quantum meruit is taught on Day 3's lien lesson. Here the question is whether there was ever an engagement to value. That is Atty. Thorne's call; the trainee's job is to make the call easy.
- Run the John Doe call live. He will be embarrassed when it turns out to be his mother. A good Case Manager stays neutral and kind, and never says the agreement is void.

---

### 4.1.17 Disbursement Command Triggering: Releases, Hold Cleared, Money Out

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Final Accounting Check (`d3m4`)  
> **Topic:** Skill Activity 3 — confirm every gate, then move the money to $0.00  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#33` The Execution: The Release of All Claims (The “Exit” Document) · `D2#35` The Execution: Lien Payoff Letters (The “Verification” Paperwork) · `D2#38` The Execution: W-9 & Comparison of Key Post-Settlement Documents · `D2#41` Skill Building: BI Settlement — Caught in an Operational Pincer Movement · `D3#26` The Net Sheet: Case Manager Protocols for Dual Settlements · `D3#29` Case Phase: Disbursement — Core Objectives · `D3#30` Disbursement: The Workflow · `D3#31` Disbursement: Documentation Checklist · `D3#32` Disbursement: Common Challenges & Mitigation · `D3#34` Final Case Reconciliation Checklist: Proof of Delivery/Completion

#### 1 · Visual Layout Description

Two panels joined by an orange arrow dated 10/21 → 10/22. Left: a navy-header checklist card, CONDITIONS PRECEDENT, with green ticks: LIMITED RELEASE EXECUTED 08/28 · UM RELEASES FILED · FUNDS CLEARED 10/20 · STATEMENT SIGNED 10/21 · PAYOFF LETTERS · LIEN HOLD RELEASED 10/19 (a struck-through red chip beneath it reads VANCE & KETTERING $6,666.67 — WITHDRAWN). Right: the CMS Trust screen as a table of five disbursement commands, payee and mono amount on each, each with an empty ATTY. THORNE · APPROVE chip, and a running-balance column ending in a green $0.00. The argument: the checklist on the left is what makes the commands on the right safe.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 10/21/2026. All three checks ($40,000.00) had cleared in the IOLTA trust account by 10/20 (the last, Cardinal State's, deposited 10/13); John Doe signed the Settlement Statement this morning; the Peach State and Riverton Spine & Rehab Payoff Letters are in Documents; Vance & Kettering withdrew its lien in writing on 10/19 and Atty. Thorne released the hold; disbursement is set for 10/22.

**Execution prompt.** Confirm every condition precedent against the documents: Keystone's executed Limited Release and both UM releases, cleared funds, the signed statement, the Payoff Letters, and the prior-attorney lien withdrawn with the hold released by Atty. Thorne. Then queue one disbursement command per Net Sheet line in the Trust Ledger for Atty. Thorne's approval, each matching its line, and show the ledger reaching $0.00.

| | |
|---|---|
| **Tool / interface** | CMS → Documents · CMS → Financial Ledger → Trust |
| **Expected output** | A confirmed checklist of conditions precedent and five approval-ready disbursement commands that take the Trust Ledger from $40,000.00 to $0.00. |

**Verification checkpoints**

- [ ] Keystone's Limited Release executed 08/28/2026 on file (Smith and Keystone only, the UM claims and the Civic's claim reserved), with both UM consents and waivers
- [ ] Both UM releases filed as approved; Harbor Point's checked for any line reaching Cardinal State before John Doe signed it
- [ ] All funds cleared by 10/20; statement signed 10/21; Payoff Letters in hand; no cooling-off period configured for this training file (confirm the governing rule)
- [ ] Vance & Kettering's written withdrawal (10/19/2026) on file and the $6,666.67 hold released by Atty. Thorne, not by the CM
- [ ] Five commands matching the Net Sheet: to the firm, fee $13,333.33 and costs reimbursed $486.75; Peach State Health Plan $1,240.00; Riverton Spine & Rehab $4,580.00; John Doe $20,359.92
- [ ] Ledger arithmetic shown: $40,000.00 – $13,333.33 – $486.75 – $1,240.00 – $4,580.00 – $20,359.92 = $0.00
- [ ] Each command's packet complete: payee identity, Payoff Letter or receipts with date, description and tax ID, a current W-9, payment details verified by phone to a number on file, and John Doe's signed Settlement Statement as his payment authorization
- [ ] Each lien check requests a signed satisfaction of lien; John Doe's check goes with an acknowledgment of receipt to sign
- [ ] Invoice and payoff references cross-checked so no payee is paid twice
- [ ] Every command marked for Atty. Thorne's approval and signature; none released by the CM

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Funds cleared (10/20) and statement signed (10/21) | Confirm every condition precedent, the lien hold's release included | CMS → Documents · CMS → Financial Ledger → Trust | Each condition tied to its document; nothing assumed |
| Conditions confirmed | Queue five disbursement commands with their packets | CMS → Financial Ledger → Trust | Commands total $40,000.00; ledger projects to $0.00 |
| Atty. Thorne approves and signs (10/22/2026) | Post each disbursement; request lien satisfactions and John Doe's receipt | CMS → Financial Ledger → Trust · Email Workspace | Ledger reads $0.00; file marked Paid only once receipt is confirmed |

**Best practices & pitfalls**

- Tick each condition against its document, not against memory.
- A hold is lifted by the attorney who placed it, in writing, before a command is queued.
- Collect lien satisfactions with the payment, not weeks later.
- ⚠️ Pitfall: queuing a command before the funds clear because the check “is good”.
- ⚠️ Pitfall: paying out while a disputed amount is still on hold.

#### 3 · Knowledge Check & CM Summary

Verified in Final Accounting Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Conditions precedent | Executed releases, consents, cleared funds, signed statement, Payoff Letters and the lien withdrawal all confirmed before 10/22 |
| 🤖 AI | **20%** | Disbursement accuracy | Five commands at the Net Sheet amounts; ledger shown reaching $0.00 |
| 🤖 AI | **20%** | Packet completeness | Identity, Payoff Letter or receipts with tax ID, W-9, verified payment details, satisfaction and receipt requests |
| 🧑‍🏫 Trainer | **15%** | Gate judgment | Treats cleared funds, the signed statement and the released hold as hard gates, not formalities |
| 🧑‍🏫 Trainer | **10%** | Fraud and duplicate controls | Payment details verified by phone; references cross-checked |
| 🧑‍🏫 Trainer | **15%** | UPL and authority boundary | No hold lifted, check released or term changed by the CM |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open on the checklist and ask what would stop the money on 10/22. Make the room name every gate, the 10/19 lien withdrawal included.
- Ask: “Vance & Kettering withdrew on 10/19. Who lifts the hold?” Atty. Thorne, in writing. The CM records it.
- Grade the arithmetic: five commands must total $40,000.00 and leave $0.00. A command queued before 10/20, or while the hold stood, fails the block however accurate its amount.
- The release audit itself happened on 08/14, in Settlement Negotiations; here the Case Manager confirms the executed release is the one Atty. Thorne approved.

---

### 4.1.18 Routing the UM Impasse: Arbitration or Court

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** Skill Activity 3 — read the clause, route the dispute, track it in the CMS  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#33` The Execution: The Release of All Claims (The “Exit” Document) · `D3#5` UM Demand: Investigation & Evaluation — The Weak File vs. The Legal Trap · `D3#19` Key Legal Doctrines Used for Reduction · `D4#2` Introducing the Neutral: Mediator vs. Arbitrator — Expertise & Background · Newly authored: the impasse memo that quotes each layer's clause and asks the route, the per-layer deadline and consolidation as three written questions

#### 1 · Visual Layout Description

A two-pane working screen. Left, two stacked policy cards with a highlighted clause block in each: HARBOR POINT · HOST UM · $20,000 shows its arbitration paragraph lit in orange with a mono pill BINDING; CARDINAL STATE · RELATIVE UM · $10,000 shows the same region greyed, stamped CERTIFIED POLICY REQUESTED and a question chip CLAUSE? Right, the CMS ADR tab part-filled: ADR TYPE = UM / UIM ARBITRATION, HOW IT WAS SET = REQUIRED BY THE POLICY OR CONTRACT, with three empty mono date fields and a navy task card, DEADLINE PER LAYER — ASK ATTY. THORNE. Across the bottom a red strip: NO ROUTE IS DOCKETED UNTIL HE ANSWERS IN WRITING.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 04/05/2027, Track B. Keystone tendered its $10,000 BI limits at the 03/18/2027 mediation; both UM carriers consented in writing, the Limited Release was signed and Robert Smith was dismissed. The UM demands went out 03/22/2027. Harbor Point's Marcus Bell (HP-26-7741) offered $8,000 on 03/31/2027 against a $20,000 Host UM limit, calling the 14-Day Gap a causation problem. Cardinal State's Teresa Okafor (CS-26-20355) offered $6,000 on 04/02/2027 against a $10,000 Relative UM limit. Today both refuse to move. Harbor Point's UM policy contains a binding arbitration clause; Cardinal State's certified policy has been requested and has not arrived. The suit against Robert Smith, filed 09/24/2026, ended with his dismissal after the mediation; the tort SOL is 02/06/2028.

**Execution prompt.** Route the UM impasse. Write the impasse memo to Atty. Thorne: the offers against the limits, Harbor Point's stated reason, and the dispute-resolution clause of each layer quoted, not paraphrased, with Cardinal State's marked as outstanding. Lay out both resolution routes and what each would require operationally, and ask him, in writing, for the governing route on each layer, each layer's own suit or arbitration-demand deadline, and whether the two should be heard together. Then set up the CMS to carry the answer: the ADR entry, the case status, a task per open question, and the calendar entries you will make once he answers. Finally, draft what you will say to John Doe when he calls to ask what happens now.

| | |
|---|---|
| **Tool / interface** | CMS → Case Notes · CMS → Insurance tab → Coverage Matrix · CMS → ADR tab · CMS → Tasks · CMS → Calendar |
| **Expected output** | An impasse memo with both clauses quoted and three written questions to Atty. Thorne, a CMS file that shows the route, and a procedural explanation for John Doe with no opinion in it. |

**Verification checkpoints**

- [ ] Both claims named as first-party claims under John Doe's own contract, distinct from the Keystone third-party claim that closed at the 03/18/2027 mediation
- [ ] Offers set against the limits exactly: $8,000 against $20,000 (Harbor Point, 03/31/2027) and $6,000 against $10,000 (Cardinal State, 04/02/2027), $14,000 against $30,000 in all
- [ ] Exhaustion documented, not assumed: Keystone's $10,000 tender at the 03/18/2027 mediation, both UM consents, the Limited Release and the order dismissing Robert Smith
- [ ] Harbor Point's arbitration clause quoted verbatim and identified as binding; no interpretation offered
- [ ] Cardinal State treated as its own layer: the certified policy and its dispute-resolution and other-insurance clauses recorded as outstanding, with a chase task, and Harbor Point's clause never read onto it
- [ ] Both routes laid out with their operational consequences: a Demand for Arbitration and its forum dates, or a civil suit against the carrier where state law bars the clause or permits opt-out
- [ ] Bad faith raised only as a question for Atty. Thorne, with Harbor Point's handling dates recorded as facts; no assertion that any conduct was unreasonable
- [ ] Three written questions asked: the governing route per layer, each layer's own suit or arbitration-demand deadline, and whether the layers are consolidated
- [ ] Nothing docketed from assumption: the calendar entries are drafted and held, to be entered only from his written answer; the tort SOL 02/06/2028 is not used as a UM deadline
- [ ] CMS set up to carry the answer: ADR Type UM / UIM arbitration, How It Was Set Required by the policy or contract, status matching the route, a task per open question with an owner and a date
- [ ] The explanation to John Doe is procedural only: what a Demand for Arbitration is in plain words, that a neutral will decide rather than a jury, and that Atty. Thorne will go through what it means for his claim; no view on the offers, the limits or the carrier's conduct

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Both UM carriers hold at their offers, 04/05/2027 | Write the impasse memo with both clauses quoted | CMS → Case Notes | Memo dated 04/05/2027; Cardinal State's clause marked outstanding |
| Certified policy outstanding | Chase it and log the request | CMS → Tasks | Chase task with an owner and a date; the gap stated in the memo, not filled in |
| Questions sent to Atty. Thorne | Hold every date; draft the entries without saving them | CMS → Calendar | Nothing docketed; the drafts wait on his written answer |
| John Doe calls to ask what happens now | Explain the procedure; route value and conduct to Atty. Thorne | CMS → Case Notes → Client Communications | Call logged the same day with what was said and what was routed |

**Best practices & pitfalls**

- Quote the clause and stop; the memo's job is to put the words in front of counsel.
- Give each layer its own section, its own clause and its own deadline question.
- Record the handling dates that a bad-faith question would turn on, and ask the question rather than answer it.
- ⚠️ Pitfall: docketing an arbitration-demand deadline from the tort SOL.
- ⚠️ Pitfall: assuming consolidation because both layers are UM.
- ⚠️ Pitfall: telling John Doe the firm is suing Harbor Point before Atty. Thorne has read the clause.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Figures and dates | $8,000 / $20,000 and $6,000 / $10,000 with their dates; exhaustion evidenced by the 03/18/2027 tender, the consents, the Limited Release and the dismissal |
| 🤖 AI | **20%** | Clause handling | Harbor Point's clause quoted and identified as binding; Cardinal State's recorded as outstanding and read separately |
| 🤖 AI | **15%** | Routes laid out | Both routes with their operational consequences; bad faith kept separate and above the limits |
| 🤖 AI | **10%** | Nothing assumed | No date docketed before the written answer; the tort SOL not used as a UM deadline |
| 🧑‍🏫 Trainer | **15%** | Memo quality | Counsel can decide from it: offers against limits, clauses verbatim, questions numbered |
| 🧑‍🏫 Trainer | **10%** | Client explanation | Plain, procedural and calm; no value, no conduct, no prediction |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Recommends nothing legal; the route, the deadlines and bad faith all go to Atty. Thorne as questions |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Grade the memo on whether Atty. Thorne could make three decisions from it without opening the file. If he would have to go looking for the clause, it failed.
- The commonest failure is a trainee who writes “Harbor Point's policy requires arbitration, so we will file a Demand for Arbitration on…” — a route decided and a date set in one sentence. Both are his.
- Second commonest: Cardinal State folded into Harbor Point's clause because both are UM. Make them say what they actually have from Cardinal State, which on 04/05/2027 is a requested policy and nothing else.
- Run the client call live if there is time. John Doe will ask whether the insurance company is allowed to do this. The right answer explains the procedure and promises Atty. Thorne's call, and says nothing about whether it is allowed.

---

### 4.1.19 Auditing Court Hard Rules & Setting Calendar Cutoffs

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** Skill Activity 1 — find the dates that would cost the file  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D5#28` Master Timeline & Deadline Calculations · `D4#18` Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules · `D4#5` Mediation Protocols for CMs: Logistics & Scheduling · Newly authored: calendar-error risk (later or missing costs rights; earlier costs time)

#### 1 · Visual Layout Description

The Case Docket & Calendar Conflict Resolver fills the slide: a white table card with a navy header bar, one row per staged entry, the as-keyed date in a mono pill and a blank status chip at the right of each row (VERIFIED · CORRECTED · ADDED) for the trainee to set. A single dashed-orange ADD ENTRY row sits at the bottom, unlabelled, so the slide reveals neither what is missing nor how much. Down the right edge runs a vertical two-band risk gauge: an upper red band, COSTS RIGHTS — LATER OR MISSING, and a lower grey band, COSTS TIME — EARLIER. The trainee drags each error onto the gauge. The red band sits on top: rights before time.

#### 2 · Slide Body — the scenario and the task

**Scenario.** It is 12/10/2026. The Scheduling Order in No. 26-CV-04417 was entered today. The defendant's Interrogatories (25), Requests for Production (30) and Requests for Admission (15), served on his counsel, Atty. Thorne, by U.S. mail on 12/01/2026, are in the file. The order reads: plaintiff's expert disclosure 03/15/2027; defense expert disclosure 04/15/2027; mediation to be completed by 03/31/2027; discovery closes 05/28/2027; pretrial conference 08/12/2027; trial calendar 09/13/2027. While you were out, a covering colleague re-keyed the calendar from the paper file instead of carrying over the 09/10/2026 transition entries: unverified; no alerts.

**Execution prompt.** Audit John Doe's calendar in the Case Docket & Calendar Conflict Resolver against the 12/10/2026 Scheduling Order, the discovery mailed 12/01/2026 and the 02/06/2028 SOL. Recompute every entry from its trigger document: trigger day out, 3 mail days in, forward counts to the next business day, backward to the earlier. Correct errors, add missing entries, leave correct ones alone. Give every entry its trigger, rule, arithmetic, owner and alerts. Mirror every corrected entry to John Doe's CMS Calendar. Rank errors by risk; log the corrections in CMS Case Notes and route them to Atty. Thorne.

| | |
|---|---|
| **Tool / interface** | Case Docket & Calendar Conflict Resolver · Docket System · CMS → Calendar · Case Notes |
| **Expected output** | A verified Litigation Calendar with every planted error corrected, the missing entries added, and a ranked correction log routed to Atty. Thorne. |

**Show Them — reference model**

*The staged calendar, as keyed (unverified; no alerts set)*

| Entry as keyed | Date |
|---|---|
| Answer due (Smith served 10/14/2026) · filed 11/12/2026 | 11/13/2026 |
| Responses to defendant's discovery (mailed 12/01/2026) | 12/31/2026 |
| Plaintiff's expert disclosure | 04/15/2027 |
| Defense expert disclosure | 03/15/2027 |
| Mediation session | 03/31/2027 |
| Other order dates, as keyed | 05/28 · 08/12 · 09/13/2027 |
| Internal filing cutoff | 11/08/2027 |
| Statute of limitations | 02/06/2028 |

**Verification checkpoints**

- [ ] Responses corrected to 01/04/2027 (Mon): 12/01/2026 + 30 = 12/31/2026, + 3 for mail = 01/03/2027, a Sunday → next business day
- [ ] RFA entry added: all 15 requests due 01/04/2027, flagged “deemed admitted if unanswered”
- [ ] Expert disclosures un-swapped: plaintiff's 03/15/2027 (ours), defense 04/15/2027
- [ ] Mediation re-entered as “completed by 03/31/2027”, a deadline, with a task to collect 3–4 windows before the mediator's office is contacted
- [ ] Internal hard date 02/04/2028 (Fri) added; SOL 02/06/2028 kept, marked a Sunday and never relied on
- [ ] Filing cutoff corrected from 11/08/2027 to 11/05/2027: 90 days before 02/04/2028 is 11/06/2027 (Sat) → earlier business day
- [ ] Answer, discovery-close, pretrial and trial-calendar entries verified and left unchanged
- [ ] Every entry carries its trigger document, rule, arithmetic, owner and warning alerts
- [ ] Every corrected entry mirrored to the CMS Calendar; the correction log in CMS Case Notes
- [ ] Errors ranked: the missing and later-than-correct entries ahead of the early 12/31/2026 entry
- [ ] Correction log routed to Atty. Thorne with rule questions flagged “confirm the court's rules”; no extension discussed with opposing counsel

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Scheduling Order entered 12/10/2026 | Audit every entry against its trigger document | Case Docket & Calendar Conflict Resolver | Every planted error found; correct entries untouched |
| Errors corrected | Give each entry its trigger, rule, owner and alerts | Docket System | No entry without a trigger document and alerts |
| Audit complete | Route the ranked correction log, rule questions flagged | CMS → Tasks → Escalate | Routed to Atty. Thorne the same day |

**Best practices & pitfalls**

- Recompute from the trigger document, never from the entry you are checking.
- Mark correct entries as verified; an audit that changes everything can't be trusted either.
- ⚠️ Pitfall: fixing what is on the screen and missing what isn't, such as the RFA entry.
- ⚠️ Pitfall: “fixing” 11/06/2027 by rolling it forward to Monday.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Error detection | All six planted errors found: mail days, RFA entry, swapped disclosures, mediation deadline, filing cutoff, SOL internal date |
| 🤖 AI | **20%** | Date accuracy | 01/04/2027, 03/15/2027, 04/15/2027, 02/04/2028 and 11/05/2027 exactly, arithmetic shown |
| 🤖 AI | **10%** | No false positives | Answer, discovery-close, pretrial and trial-calendar entries left unchanged |
| 🤖 AI | **10%** | Entry completeness | Trigger, rule, arithmetic, owner and alerts on every entry |
| 🧑‍🏫 Trainer | **25%** | Risk triage | Missing and later-than-correct entries ranked first, with a reason that holds |
| 🧑‍🏫 Trainer | **15%** | Authority boundary | Rule questions routed to Atty. Thorne; no extension or stipulation raised with opposing counsel |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Hand out the staged calendar with no hint of how many errors it holds. Ask each trainee to initial the entries they would sign their name to before they recompute anything.
- Put to the room: “12/31/2026 is wrong and 11/08/2027 is wrong. Which one could cost John Doe his claim?” The early date costs time; the late one costs rights.
- Watch for the missing RFA entry. Trainees fix what is on the screen and miss what isn't, and the deemed-admission risk is the nearest deadline on this calendar and one of the most severe.
- Legal nuance: many courts accept a Monday filing when a limitation period ends on a Sunday. The firm rule refuses to rely on it, and which rule governs is Atty. Thorne's call. A trainee who calls opposing counsel about an extension fails the authority row.

---

### 4.1.20 Calendaring the Mediation: the Session and Every Date That Hangs Off It

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** Skill Activity — calendar the 03/18/2027 mediation from its triggers  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#5` Mediation Protocols for CMs: Logistics & Scheduling · `D5#28` Master Timeline & Deadline Calculations · `D4#18` Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules · Newly authored: calendaring a Notice of Mediation from its triggers — the session, the statement-and-binder deadline, backward internal dates, the mediator's report, the client's confirmation, the fee as a cost, and the UM consent-to-settle flag

#### 1 · Visual Layout Description

A horizontal date rail across the slide from 01/08/2027 to 03/31/2027, the Notice of Mediation as a navy pin at the left edge and the Scheduling Order's red COMPLETED BY 03/31/2027 flag at the right. One large navy session card sits on 03/18/2027 (Thu) · 9:30 a.m. with four attendee chips (ATTY. THORNE · JOHN DOE · CM — LOGISTICS · KEYSTONE — FULL AUTHORITY?). Orange backward arrows run left from it to 03/11/2027 (STATEMENT + BINDER) and on to 03/09, 03/04 and 03/02/2027, each a blank mono pill for the trainee to fill. Below the rail, a grey conflict lane holds the master calendar's own entries (01/13/2027 · 03/15/2027 · 05/28/2027) with one amber overlap marker between 03/11 and 03/18. In the top-right corner, two small cards: a money card, PLAINTIFF'S HALF $1,200.00 → CASE COST, and a red flag card, UM CONSENT BEFORE ANY BI RELEASE → ATTY. THORNE. The argument: one notice, a dozen dates, each counted from its own trigger.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 01/08/2027 (Fri), Track B. Today the Notice of Mediation was filed in No. 26-CV-04417: court-ordered mediation before Hon. Carla Benton (Ret.), selected by Atty. Thorne from the four windows collected 12/17/2026, on 03/18/2027 (Thu) at 9:30 a.m. at her office. The confidential statement and binder are due 7 days before; client attendance is required. The Order of Referral entered 12/10/2026 with the Scheduling Order requires mediation completed by 03/31/2027, a notice of the mediator and session date within 30 days, attendance by each party, lead counsel and an insurer's representative with full authority to settle, the mediator's report within 7 days after the session, and the mediator's fees divided equally between the sides; the plaintiff's half is $1,200.00. The 12/10/2026 calendar audit already entered “completed by 03/31/2027” and a task to collect the windows. Harbor Point's and Cardinal State's policies each require their written consent before any settlement with Keystone. On the master calendar: Robert Smith's responses to our discovery due 01/13/2027; plaintiff's expert disclosure 03/15/2027; discovery closes 05/28/2027.

**Execution prompt.** Calendar the mediation in the Calendaring Simulators and mirror every entry to John Doe's CMS → Calendar. Verify the trigger first: the notice against the order's 30-day selection rule, and the session date against the 03/31/2027 completion deadline, linking to the existing deadline and closing the windows task rather than re-entering either. Enter the session with its attendees and its location. Count the statement-and-binder deadline back from the session, then the internal dates back from that deadline, then the mediator's report forward from the session. Calendar the client's written confirmation, his prep meeting request and his reminders. Track the $1,200.00 fee as a case cost. Flag the UM carriers' consent-to-settle requirement for Atty. Thorne with the 30-day arithmetic. Conflict-check every new date against the master calendar and route the summary to Atty. Thorne the same day, ranking what needs his decision.

| | |
|---|---|
| **Tool / interface** | Calendaring Simulators · CMS → Calendar · Docket System · CMS → Tasks · CMS → Case Notes |
| **Expected output** | A mediation calendar of verified, trigger-counted entries mirrored to the CMS, a cost task for the fee, a client-confirmation task, and a same-day summary to Atty. Thorne with the UM consent flag and the one conflict. |

**Verification checkpoints**

- [ ] Trigger verified: the Notice of Mediation filed 01/08/2027 (Fri) meets the order's 30-day rule (12/10/2026 + 30 = 01/09/2027, a Saturday); the 12/10/2026 windows task closed with the notice attached, not re-created
- [ ] Session entered once: 03/18/2027 (Thu), 9:30 a.m., in person at Hon. Carla Benton (Ret.)'s office, court-ordered; the day blocked for Atty. Thorne, John Doe and the CM (logistics only)
- [ ] Attendance read from the order: each party (John Doe; Robert Smith with Atty. Grant Mercer) and a Keystone representative with full authority to settle; the representative's name logged as “to be confirmed by Atty. Mercer”, not guessed
- [ ] Completion deadline verified, not re-entered: 03/18/2027 is 13 days inside 03/31/2027 (Wed); the 12/10/2026 “completed by” entry linked to the session
- [ ] Statement and binder: 03/18/2027 − 7 = 03/11/2027 (Thu), a weekday, so no roll; marked confidential, for the mediator only
- [ ] Internal dates counted back from 03/11/2027: Litigation Desk's draft index 03/02/2027 (Tue); binder QC 03/04/2027 (Thu), 7 days before; routed to Atty. Thorne for approval by 03/09/2027 (Tue), 2 business days before delivery
- [ ] Mediator's report watched forward from the session: 03/18/2027 + 7 = 03/25/2027 (Thu)
- [ ] Client: written confirmation of attendance requested 01/08/2027 with a follow-up tickler 01/15/2027 (Fri); prep meeting requested from Atty. Thorne, entered when he sets it; reminders 03/11/2027 and 03/17/2027 (Wed)
- [ ] Fee tracked as a cost: the order divides fees equally, so $1,200.00 is half of $2,400.00; costs advanced $486.75 + $218.00 + $285.00 = $989.75 → $2,189.75 once paid; routed to accounting, posted only on the receipted invoice
- [ ] UM flag: Harbor Point and Cardinal State each require written consent before any BI settlement, with 30 days from written notice to consent or advance; a tentative settlement noticed 03/18/2027 runs to 04/17/2027 (Sat); routed to Atty. Thorne as a question, no carrier contacted
- [ ] Conflict check: plaintiff's expert disclosure 03/15/2027 (Mon) falls between binder delivery and the session, flagged as a workload overlap; 01/13/2027 and 05/28/2027 clear; no conflict on 03/18/2027
- [ ] Every entry carries its trigger, rule, arithmetic, owner and alerts in the Calendaring Simulators and the CMS → Calendar; the summary routed to Atty. Thorne on 01/08/2027

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Notice of Mediation filed 01/08/2027 | Verify the trigger; enter the session; close the windows task | Calendaring Simulators · CMS → Calendar | Session 03/18/2027 entered once; 30-day rule and 03/31/2027 verified |
| Session entered | Count the statement, binder and internal dates back; the report forward | Docket System | 03/11, 03/09, 03/04, 03/02 and 03/25/2027, each with its arithmetic |
| Order divides the mediator's fees equally | Open the cost task for the plaintiff's $1,200.00 half | CMS → Tasks → Accounting | Posted to the Case Cost Ledger only on the receipted invoice |
| Calendar built | Route the summary: the UM consent flag and the 03/15/2027 overlap | CMS → Tasks → Escalate | Routed to Atty. Thorne the same day |

**Best practices & pitfalls**

- Count each date from its own trigger: the session from the notice, the binder from the session, the QC from the binder.
- Link to the 12/10/2026 entries instead of keying them again; one date, one entry.
- Read the attendance paragraph of the order, then calendar the people it names.
- ⚠️ Pitfall: entering 03/31/2027 as the session or 03/18/2027 as the deadline.
- ⚠️ Pitfall: rolling a backward internal date forward when it lands on a weekend.
- ⚠️ Pitfall: posting the $1,200.00 fee before the invoice arrives, or not tracking it at all.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Date accuracy | 03/18, 03/11, 03/09, 03/04, 03/02 and 03/25/2027 exactly, with the arithmetic and weekdays shown |
| 🤖 AI | **10%** | Trigger verification | 30-day selection rule and 03/31/2027 deadline verified; existing entries linked, not duplicated |
| 🤖 AI | **10%** | Attendance and client | Attendees read from the order; John Doe's confirmation, tickler and reminders calendared |
| 🤖 AI | **10%** | Cost tracking | $1,200.00 as half of $2,400.00; $989.75 → $2,189.75; posted only on the invoice |
| 🤖 AI | **10%** | Conflict check | 03/15/2027 overlap flagged; 01/13 and 05/28/2027 cleared |
| 🧑‍🏫 Trainer | **15%** | Calendar usability | A colleague could run the mediation from the entries alone: trigger, owner and alerts on each |
| 🧑‍🏫 Trainer | **10%** | UM consent flag | Both carriers' consent requirement and the 04/17/2027 arithmetic put to Atty. Thorne as a question |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | No carrier contacted, no value or strategy discussed with John Doe or Atty. Mercer; prep and authority left to Atty. Thorne |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Before anyone opens the simulator, ask the room how many dates one notice creates. Most say two; this file has at least eight, and each has a different trigger.
- Watch for the duplicate. The 12/10/2026 audit already entered “completed by 03/31/2027”; a trainee who keys it again now has two entries that can drift apart. Linking it to the session is the skill.
- The UM flag is the one that can cost money. If Keystone tenders at the table, nothing can be released without Harbor Point's and Cardinal State's written consent. The CM puts the requirement and the 30-day arithmetic in front of Atty. Thorne; whether and when to notify the carriers is his call.
- The conflict check is not about the session day, which is clear. It is the Monday in between: plaintiff's expert disclosure on 03/15/2027 lands after the binder goes out and before the session, and the team needs to know that in January.

---

### 4.1.21 ADR Rules Matrix & UPL Boundary Mapping

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** Skill Activity 2 — what changes from compromise to decision  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#16` Case Phase: Arbitration — The Anatomy of a PI Arbitration · `D4#17` Arbitration: Operational Mindset — From Compromise to Trial-Ready · `D4#18` Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules · `D4#19` Arbitration Operational Track 2: Logistics & Setup Protocols · `D4#20` Ethics & Boundaries: What You Can and Cannot Do at Hearings (UPL)

#### 1 · Visual Layout Description

A matrix canvas across two-thirds of the slide: row labels down the left in navy small caps (NEUTRAL & POWER · BINDING & APPEAL · CONFIDENTIALITY · OPPOSING PARTIES · LIMITS IN PLAY · STANDARD · HARD DATES · LOGISTICS), a navy-soft MEDIATION column and a solid navy ARBITRATION column, every cell empty and outlined in orange for the trainee. The right third holds the UPL boundary map as a plan view of the hearing table: Atty. Thorne's seat at the table edge in navy with a speech mark, the CM's seat behind it in orange with a red-struck speech mark and an orange arrow labelled HAND HIM THE DOCUMENT. The struck speech mark is the slide's argument.

#### 2 · Slide Body — the scenario and the task

**Scenario.** It is 04/05/2027. The 03/18/2027 mediation before Hon. Carla Benton (Ret.) produced Keystone's $10,000 BI tender: BI is exhausted, the UM consents are in, and Robert Smith is dismissed. Today Harbor Point and Cardinal State dispute damages, citing the gap. Harbor Point invokes its UM arbitration clause; Cardinal State joins one consolidated binding arbitration before Laura Whitcomb, Esq. Hearing: 06/22/2027 (Tue). The forum's schedule, as configured for this training file: exhibits exchanged 20 days before the hearing; the arbitration brief due 10 days before. Confirm the forum's rules.

**Execution prompt.** Build the ADR rules matrix for John Doe's file: a column for the 03/18/2027 mediation and one for the 06/22/2027 arbitration, with rows for the neutral and her power, binding effect and appeal, confidentiality, the opposing parties, the limits in play, the preparation standard, the CM's hard dates and the logistics. Hard-code the arbitration dates today, counting back from the hearing. Then map the UPL boundary for the hearing: what you do, what you never do, and your exact words if Laura Whitcomb, Esq. asks you about a bill. Route both to Atty. Thorne.

| | |
|---|---|
| **Tool / interface** | Action Plan Editor → ADR rules matrix · CMS → Calendar |
| **Expected output** | A two-forum rules matrix, the arbitration dates hard-coded with alerts, and a one-page UPL boundary map for the 06/22/2027 hearing, routed to Atty. Thorne. |

**Show Them — reference model**

*The arbitration track's three hard dates (fill in this file's)*

1. **Hearing date** — The trial-like date: argument, cross-examination, evidence. Every other date counts back from it.
2. **Brief deadline** — The cutoff for factual claims, legal arguments, the exhibit index and the witness list.
3. **Arbitrator selection cutoff** — The deadline to vet and strike names from a panel such as AAA or JAMS; recorded as met once the neutral is named.

**Verification checkpoints**

- [ ] Mediation column: Hon. Carla Benton (Ret.) facilitates only; non-binding; when a deal binds and what stays confidential follow the governing rule (confirm it); court-ordered and held 03/18/2027, inside 03/31/2027
- [ ] Arbitration column: Laura Whitcomb, Esq. acts as judge; binding award; court review on narrow grounds only; invoked under Harbor Point's UM clause, Cardinal State joined
- [ ] Opposing parties: Robert Smith (defended by Keystone's counsel) at mediation → Harbor Point and Cardinal State at arbitration
- [ ] Limits in play: $20,000 Host UM + $10,000 Relative UM = $30,000; the $10,000 BI tender recorded as the exhaustion that opened them
- [ ] Exhibit exchange docketed 06/02/2027 (Wed), 20 days before the hearing
- [ ] Brief docketed 06/11/2027 (Fri): 10 days before is Saturday 06/12, so it moves back to the earlier business day, never forward to 06/14/2027
- [ ] Selection cutoff recorded as met: the neutral, Laura Whitcomb, Esq., is named
- [ ] Standard row: compromise-ready for mediation; trial-ready for arbitration, every exhibit audited and every deadline locked
- [ ] Logistics row: fee schedule confirmed, retainer routed to accounting with written payment confirmation, internal invites, room or secure video with breakouts
- [ ] UPL map: never argue, speak on the record, speak for John Doe, negotiate or advise him on a number; do observe, log directives and update the CMS
- [ ] Scripted deferral: “I'm the Case Manager providing administrative assistance; Atty. Thorne will address that,” and the document handed to him

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Arbitration invoked 04/05/2027 | Hard-code the hearing, exhibit-exchange and brief dates with alerts | CMS → Calendar → Master calendar | 06/02, 06/11 and 06/22/2027 entered the same day; nothing on 06/14/2027 |
| Arbitrator's fee schedule and retainer request received | Confirm the schedule; route the retainer; file the payment confirmation | CMS → Tasks → Accounting | Written payment confirmation filed before the hearing |
| Matrix and UPL map drafted | Route to Atty. Thorne before the team works from them | Action Plan Editor → Route for review | Routed with timestamp; approved version recorded |

**Best practices & pitfalls**

- Build the matrix for the colleague who staffs the hearing with you, not for yourself.
- Write the deferral script before the hearing, and say it aloud once.
- ⚠️ Pitfall: a brief deadline that lives only in an email.
- ⚠️ Pitfall: treating the UM carriers as friendly because the coverage is first-party; on 06/22/2027 they are the other side.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Forum accuracy | Neutral, power, binding effect, appeal and confidentiality correct in each column |
| 🤖 AI | **10%** | Parties and limits | Opposing parties change correctly; $20,000 + $10,000 = $30,000 in play; BI exhaustion recorded |
| 🤖 AI | **15%** | Hard-date accuracy | 06/02/2027, 06/11/2027 (not 06/14/2027) and 06/22/2027, each with alerts |
| 🤖 AI | **15%** | UPL map completeness | Every never and every do item, plus the scripted deferral |
| 🧑‍🏫 Trainer | **15%** | Mindset shift | Explains what changes operationally from compromise to trial-ready, not just that it changes |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | The deferral is genuinely deferential; nothing on the map lets the CM speak to the merits |
| 🧑‍🏫 Trainer | **5%** | Team usability | A colleague could staff the hearing from the matrix cold |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the question, now on this file: “What changes operationally when a file moves from mediation to arbitration?” Write the answers in two columns on the board before anyone opens the editor.
- Ask the room: “On 03/18/2027 the other side was Robert Smith. Who is it on 06/22/2027, and what are they disputing?” The answer is the UM carriers, and the gap.
- Watch the brief date. Trainees who learned the forward rule apply it here and land on Monday 06/14/2027, after the deadline.
- Grade the scripted deferral hardest. A trainee who audited the Riverton Spine & Rehab bill knows the answer and will want to give it; that is exactly the moment the Golden Rule exists for.

---

### 4.1.22 Calendaring the Arbitration from the Scheduling Letter

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** Skill Activity — every date that hangs off the hearing  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#18` Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules · `D4#19` Arbitration Operational Track 2: Logistics & Setup Protocols · `D5#28` Master Timeline & Deadline Calculations · Newly authored: the arbitration calendar computed from the arbitrator's scheduling letter, with internal lead times counted back from the step that needs each item

#### 1 · Visual Layout Description

A horizontal calendar ribbon from 04/26/2027 to 06/22/2027. At the right end a solid navy anchor pin, HEARING 06/22/2027 9:00 A.M., with the scheduling letter clipped to it as a small white card. Orange arrows run backward from the pin to empty mono date slots (EXCHANGE · BRIEF · BINDER QC · DRAFT INDEX · RECORDS REQUESTS · CLIENT CONFIRMS · PREP · TECH CHECK), each slot with a blank RULE chip beneath it; a grey Saturday tile sits beside the BRIEF slot with a curved arrow pointing left, never right. Above the ribbon, a faint strip of master-calendar entries: three court dates carrying a navy question chip ASK ATTY. THORNE, and at the far right, off the ribbon, a red band SOL 02/04/2028 · CUTOFF 11/05/2027 marked UNCHANGED. The argument: every slot points back to one pin.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 04/26/2027 (Mon), Track B. Keystone tendered its $10,000 BI limits at the 03/18/2027 mediation and Robert Smith was dismissed. On 04/05/2027 Harbor Point invoked its UM arbitration clause and Cardinal State joined one consolidated binding arbitration before Laura Whitcomb, Esq.; Atty. Thorne has answered the route and consolidation questions, and the hearing, exhibit and brief entries drafted on 04/05/2027 wait for a trigger document. This morning her scheduling letter arrived: hearing 06/22/2027 (Tue), 9:00 a.m.; exhibits and witness lists exchanged 20 days before; briefs due 10 days before (as configured for this training file; confirm the forum's rules). The plaintiff's share of her fee is $900.00. The master calendar still carries the 12/10/2026 Scheduling Order's dates in No. 26-CV-04417 and the SOL entries.

**Execution prompt.** Calendar the arbitration from the letter. Enter the hearing and re-anchor the exchange and brief entries to it. Then compute every date that hangs off them, each from its trigger with the rule shown (backward counts move to the earlier business day): the Litigation Desk's draft exhibit index and the opening of binder QC, the certified-records requests and their chase, John Doe's attendance, witness availability, the prep session and the technology check. Route the $900.00 fee share to accounting as a case cost. Finally, check the result against the master calendar: keep the SOL entries, and for the court's dates in the dismissed suit ask Atty. Thorne in writing which stay live, rather than deleting anything.

| | |
|---|---|
| **Tool / interface** | Calendaring Simulators · Docket System · CMS → Calendar · CMS → Tasks |
| **Expected output** | A letter-anchored arbitration calendar with every dependent date, its trigger, rule, arithmetic, owner and alerts, the fee share routed as a cost, and one written question to Atty. Thorne on the court dates. |

**Verification checkpoints**

- [ ] Trigger recorded: Laura Whitcomb, Esq.'s scheduling letter of 04/26/2027 (Mon); the hearing, exchange and brief entries drafted on 04/05/2027 re-anchored to it and verified, not entered twice
- [ ] Hearing 06/22/2027 (Tue), 9:00 a.m., one day held for Atty. Thorne and the Case Manager
- [ ] Exhibit exchange and witness list 06/02/2027 (Wed): 06/22/2027 − 20 days
- [ ] Brief 06/11/2027 (Fri): 06/22/2027 − 10 days = 06/12/2027 (Sat); counting backward, the earlier business day; nothing on 06/14/2027
- [ ] Binder QC opens 05/17/2027 (Mon): 06/02/2027 − 16 days, room to sort, QC, route to Atty. Thorne and correct; the Litigation Desk's draft exhibit index due the last business day before, 05/14/2027 (Fri)
- [ ] Certified-records requests out by 05/03/2027 (Mon): QC opening 05/17/2027 − the 14-day custodian window; a tickler 14 days after each request sends the second request and the subpoena flag to Atty. Thorne
- [ ] John Doe's attendance on 06/22/2027 at 9:00 a.m. confirmed in writing by 04/28/2027 (Wed), two business days after the letter; witnesses Atty. Thorne names checked for availability before the 06/02/2027 witness list, tickler 05/17/2027
- [ ] Prep session proposed for 06/15/2027 (Tue), 7 days before the hearing, for Atty. Thorne to confirm (he leads it); technology and logistics check 06/21/2027 (Mon), the business day before
- [ ] Arbitrator's fee: the plaintiff's share, $900.00, routed to accounting on her invoice and logged as a case cost; written payment confirmation on file by 05/17/2027, when Tab 1 of the binder needs it
- [ ] SOL entries unchanged: internal hard date 02/04/2028 (Fri) and filing cutoff 11/05/2027 (Fri); 02/06/2028 (Sun) never relied on
- [ ] Court entries in No. 26-CV-04417 (discovery closes 05/28/2027, pretrial conference 08/12/2027, trial calendar 09/13/2027) kept and marked “Robert Smith dismissed: confirm vacated”, with one written question to Atty. Thorne; nothing deleted
- [ ] No award date docketed; every entry carries its trigger, rule, arithmetic, owner and alerts at 14, 7 and 1 days, mirrored from the Docket System to CMS → Calendar

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Scheduling letter arrives 04/26/2027 | Enter the hearing; re-anchor exchange and brief to the letter | Docket System · CMS → Calendar | 06/22, 06/02 and 06/11/2027 verified; nothing on 06/14/2027 |
| Hearing date fixed | Count back binder QC, records requests and the prep holds | Calendaring Simulators | 05/03, 05/14, 05/17, 06/15 and 06/21/2027, each with its rule |
| Arbitrator's invoice for the plaintiff's share | Route $900.00 to accounting as a case cost | CMS → Tasks → Accounting | Payment confirmation on file by 05/17/2027 |
| Master calendar checked | Ask Atty. Thorne which court dates stay live | CMS → Tasks → Escalate | Court entries kept and marked until he answers |

**Best practices & pitfalls**

- Enter the trigger document first, then every date that counts from it.
- Count a lead time back from the internal step that needs the item, not from the hearing.
- Mark a doubtful entry and ask; never let a calendar go quiet on a date nobody has vacated.
- ⚠️ Pitfall: counting the brief forward to Monday 06/14/2027.
- ⚠️ Pitfall: requesting certified records on a schedule that delivers them after binder QC opens.
- ⚠️ Pitfall: deleting the dismissed suit's court dates on your own reading of the dismissal.

#### 3 · Knowledge Check & CM Summary

Verified in ADR & Calendar Compliance Check (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Anchor dates | 06/22/2027, 06/02/2027 and 06/11/2027 (not 06/14/2027) re-anchored to the 04/26/2027 letter, not entered twice |
| 🤖 AI | **20%** | Dependent dates | 05/03, 05/14, 05/17, 04/21, 06/15 and 06/21/2027, each with its trigger, rule and arithmetic |
| 🤖 AI | **10%** | Fee as a cost | $900.00 plaintiff's share routed to accounting and logged as a case cost; confirmation by 05/17/2027 |
| 🤖 AI | **15%** | Conflict check | SOL 02/04/2028 and cutoff 11/05/2027 unchanged; court entries kept and marked; no award date |
| 🧑‍🏫 Trainer | **15%** | Trigger discipline | Can say, for any entry, which document set it and which rule counts from it |
| 🧑‍🏫 Trainer | **15%** | Authority boundary | Court dates and the prep date go to Atty. Thorne as questions; nothing deleted or decided |
| 🧑‍🏫 Trainer | **10%** | Client handling | John Doe's attendance confirmed in plain, procedural words; nothing on value or outcome |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Put the ribbon on the board with only the hearing pin filled. Ask the room to name every date that hangs off it before anyone opens the simulator; the binder QC and the records requests are the ones they forget.
- The records-request date is the teaching point. Counted from the exchange, it looks comfortable; counted from 05/17/2027, when QC opens and the records must already be in hand, it is 05/03/2027. A request that goes out later arrives after the binder is being built.
- On the court dates, a trainee who deletes them has guessed what the dismissal did to the case; a trainee who leaves them unmarked will chase a pretrial conference that may not exist. Marking and asking is the job.
- Grade the fee row for the word “cost”: the $900.00 is advanced by the firm and comes back from John Doe's share under the retainer. Whether it is paid or advanced, and when, is accounting's and Atty. Thorne's process, not the Case Manager's decision.

---

### 4.1.23 Assembling the 6-Section Mediation Binder

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Binder Assembly Verification (`d4m3`)  
> **Topic:** Skill Activity 1 — build it, audit it, route it before 03/11/2027  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#14` Skill Building: Create Your Mediation Binders · `D4#15` Skill Building: The LSH Critical Thinking Challenge — The Pre-Mediation Audit · `D4#7` Mediation Binder Section 1: Executive Summary & Administrative Details · `D4#8` Mediation Binder Section 2: The Mediation Briefs · `D4#9` Mediation Binder Section 3: Core Pleadings (The Legal Framework) · `D4#10` Mediation Binder Section 4: Key Evidence & Liability Exhibits · `D4#11` Mediation Binder Section 5: Damages, Financials & Expert Reports · `D4#12` Mediation Binder Section 6: Settlement History & Draft Agreements · `D4#13` Mediation: Quality Assurance & Logistics Auditor

#### 1 · Visual Layout Description

A three-column workbench. Left: the draft binder as a grey stack topped by two red landmine chips, LEDGER $15,002.40? and CRESCENT $3,400.00 OPEN?, each struck through once fixed. Centre: six navy section cards ①–⑥ with orange badges, filling with mono pills that carry exhibit numbers and Bates ranges. Right: an orange-bordered DEFENSE MAP card pairing each allegation in the 11/12/2026 answer (out of turn · unbelted · the gap · degenerative · failure to mitigate) with its exhibit by an → arrow. Along the bottom, a delivery strip: ROUTE TO ATTY. THORNE → DELIVER BY 03/11/2027 → SESSION 03/18/2027, with a red CONFIDENTIAL — MEDIATOR ONLY chip on the statement. The argument: every pleaded defense already has its page.

#### 2 · Slide Body — the scenario and the task

**Scenario.** It is 03/04/2027 on Track B. John Doe was deposed on 02/18/2027 and the certified transcript is in the file. The confidential statement and binder are due to Hon. Carla Benton (Ret.) on 03/11/2027 for the 03/18/2027 mediation. The draft binder, built from the providers' original bills instead of the audited demand ledger, carries Riverton Spine & Rehab at $6,290.00 and lists Crescent Pain & Spine's $3,400.00 as an open balance, and Atty. Grant Mercer has written that Keystone “will not put a real number on the table” while the medical ledger is unverified. Riverton Spine & Rehab's Final Itemized Ledger, requested 02/08/2027 (second request 02/22, red-flagged 03/01), is still outstanding. The Litigation Desk's draft index is in the file (RS62), assigned on the 07/15/2026 task log (RS64): QC it, do not rebuild it from nothing.

**Execution prompt.** Assemble the six-section Mediation Binder from the master index, starting from the 07/20/2026 Demand Package. Seat each document in one section with its exhibit number and Bates range, and map every allegation in the 11/12/2026 answer to the exhibit that answers it. Run the pre-mediation audit: rebuild the ledger from the certified bills in hand to $16,401.40, and cross-check each provider balance against what PIP and Peach State already paid. Add the Negotiation Log, a draft Limited Release and the UM consent requests, then route it all to Atty. Thorne before delivery.

| | |
|---|---|
| **Tool / interface** | CMS → Documents → Mediation Binder · CMS → Documents → Master index · Medical Records Requests |
| **Expected output** | A six-section, indexed, OCR-searchable Mediation Binder with an audited ledger, a lien summary and a short audit memo on both landmines, routed to Atty. Thorne and ready for delivery to the mediator by 03/11/2027. |

**Verification checkpoints**

- [ ] Section 1: snapshot sheet with LSH-2026-MVA-770412, No. 26-CV-04417 and Atty. Grant Mercer's verified contacts; session 03/18/2027 before Hon. Carla Benton (Ret.), with start time and location (or video link) taken from the order; fee split read from the mediation order or stipulation, not assumed
- [ ] Section 2: confidential statement marked for the mediator only, routed to Atty. Thorne, and its delivery calendared by 03/11/2027
- [ ] Section 3: the Complaint of 09/24/2026 and the answer of 11/12/2026 only, no draft; all three pleaded defenses listed
- [ ] Defense map: out of turn → RPD-26-018842, Ruth Calloway, doorbell video; unbelted → event data recorder (belt buckled), EMS report (“restrained”); the gap → EMS report (neck stiffness on the DOL), Gap Explanation Record and the 06/19/2026 Causation Letter; “degenerative” → the MRI read; failure to mitigate → the A-C-T record. Two legal questions flagged for Atty. Thorne, not answered: whether seatbelt evidence is admissible or can reduce damages here, and whether the Escape's alleged out-of-turn entry can affect a passenger's recovery; confirm the governing rule
- [ ] Section 4 also holds the key correspondence (Keystone's 02/17/2026 acceptance of PD liability; what weight it carries is Atty. Thorne's call) and the 02/18/2027 deposition summary with highlighted transcript pages on the gap, the disruption, the 2021 visits and the seatbelt
- [ ] Landmine 1: ledger rebuilt from the certified bills in hand, with Riverton Spine & Rehab's original 34-line bill audited to 33 visits × $185.00 = $6,105.00 (05/04/2026 duplicate removed) and marked “Pending Final Verification” until its certified ledger arrives; $14,817.40 medical + $1,584.00 wages = $16,401.40
- [ ] Landmine 2: Crescent's $3,400.00 bill shown as satisfied by Peach State's $1,860.00 contract payment, proved by Peach State's EOB (no balance billing); open liens Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00
- [ ] Section 5 carries no PD claim: the Civic is Margaret Doe's, and her Keystone PD claim runs on its own file, outside John Doe's demand and the $40,000 stack
- [ ] Section 6: Negotiation Log 07/20/2026 demand → $3,500 (08/05) → rebuttal (08/06) → $3,500 “final” (08/12) → lapse (08/21) → suit (09/24); draft release limited to Robert Smith and Keystone; consent requests to Harbor Point and Cardinal State drafted
- [ ] Master index complete: every document in exactly one section with an exhibit number and Bates range; PDF OCR-searchable and bookmarked
- [ ] Audit memo names both landmines and their fixes; binder, statement and memo routed to Atty. Thorne before delivery; nothing about value said to Atty. Mercer

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Binder due 03/11/2027 | Build the six sections from the master index | CMS → Documents → Mediation Binder | Every document in one section, numbered and Bates-ranged |
| Opposing counsel calls the ledger unverified | Chase the outstanding certified ledger and rebuild from what is certified | Medical Records Requests | Ledger ties to invoices and the Northgate HR letter: $14,817.40 + $1,584.00 = $16,401.40 |
| Binder audited | Route binder and statement to Atty. Thorne; deliver on approval | CMS → Tasks → Escalate · Email Workspace | Approved before delivery; delivery to the mediator logged by 03/11/2027 |

**Best practices & pitfalls**

- Answer every pleaded defense with a page, not a sentence.
- Pull certified billing records, not portal printouts.
- ⚠️ Pitfall: carrying the $6,290.00 bill, duplicate and all, into Section 5.
- ⚠️ Pitfall: accepting a provider balance and the plan's payment of the same bill at face value.
- ⚠️ Pitfall: no Negotiation Log, so nobody in the room is sure of Keystone's last number.

#### 3 · Knowledge Check & CM Summary

Verified in Binder Assembly Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Section completeness | All six sections built with this file's documents; each document in exactly one section |
| 🤖 AI | **15%** | Ledger audit | 33 visits = $6,105.00; $14,817.40 + $1,584.00 = $16,401.40 |
| 🤖 AI | **10%** | Lien cross-check | Crescent's bill satisfied by Peach State's $1,860.00; open liens total $7,965.00 |
| 🤖 AI | **10%** | Defense map | All five pleaded allegations mapped to answering exhibits |
| 🤖 AI | **10%** | Dates and delivery | Pleadings, negotiation-log dates and the 03/11/2027 delivery all correct |
| 🧑‍🏫 Trainer | **20%** | Binder usability | Atty. Thorne could find any page within five seconds from the index |
| 🧑‍🏫 Trainer | **10%** | Audit judgment | Both landmines found and fixed from source documents, not from the draft's own figures |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Statement, release and consents routed for approval; no value discussed with opposing counsel or the mediator |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Start with the two red landmine chips and ask who spotted them in the draft before you pointed. Most trainees fix the formatting and never test the numbers.
- Ask the room: “Atty. Mercer says the ledger is unverified. Is he wrong?” Until the duplicate is out and every line ties to a certified bill, he is right, and Section 5 is where that gets fixed.
- Grade the defense map hard: five allegations, five answers, each pointing to an exhibit number. A map that says “see Medical Records” is not a map. Then have partners swap binders and QA each other's index.
- The release and the consent requests are drafts for Atty. Thorne. Watch for trainees who write terms; the CM prepares the firm's template and the requests, and he settles every term.

---

### 4.1.24 Assembling the 6-Tab Arbitration Binder

> **Skill Activity** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Binder Assembly Verification (`d4m3`)  
> **Topic:** Skill Activity 2 — sort, QC and defuse two landmines before 06/02/2027  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#27` Skill Building: The PI Critical Thinking Audit Challenge (Arbitration) · `D4#28` Skill Building: The Arbitration Audit & Binder Build · `D4#21` Arbitration Binders: Section 1 — The Arbitration Submissions · `D4#22` Arbitration Binders: Section 2 — Core Litigation Pleadings · `D4#23` Arbitration Binders: Section 3 — Liabilities & Biomechanical Evidence · `D4#24` Arbitration Binders: Section 4 — Proving Bodily Accident Medical Damages · `D4#25` Arbitration Binders: Section 5 — The Prior Medical Shield · `D4#26` Arbitration Binders: Section 6 — Economic Losses & Lien Reconciliations

#### 1 · Visual Layout Description

A sorting board. Left column: the unsorted folder as a pile of white document cards, four flagged red: DRAFT COMPLAINT → EXCLUDE · GRAYSCALE STILLS → REPRINT IN COLOR · IMPASSE MEMO → ATTY. THORNE DECIDES · PIP $5,000.00 LIEN → STRIP. Right two-thirds: six navy tab columns ①–⑥, each headed by its QC rule in orange type, with sorted cards carrying C-numbers and Bates ranges as mono pills. Tab 1's first exhibit, C-1 BI EXHAUSTION, carries an orange padlock. A bottom timeline runs 06/02/2027 EXCHANGE → 06/11/2027 BRIEF → 06/22/2027 HEARING. The argument: QC is applied as each card lands, not after the pile is sorted.

#### 2 · Slide Body — the scenario and the task

**Scenario.** It is 05/17/2027. Keystone tendered the $10,000 BI limits at the 03/18/2027 mediation and Robert Smith was dismissed. On 04/05/2027 Harbor Point and Cardinal State disputed damages, citing the gap; Laura Whitcomb, Esq. hears the consolidated arbitration on 06/22/2027, with exhibits exchanged 06/02/2027. The unsorted exhibit folder holds a pre-filing draft of the Complaint, grayscale doorbell stills, the 09/08/2026 impasse memo, and a Lien Sheet listing Harbor Point PIP at $5,000.00 and Summit Imaging at $2,395.00. The Litigation Desk's draft exhibit index is in the file (RS63), assigned on the 07/15/2026 task log (RS64): QC it, do not rebuild it from nothing.

**Execution prompt.** Sort the folder into the six-tab Arbitration Binder and apply each tab's QC rule as you go. Lead with the BI exhaustion record, number every exhibit C-1 onward with its Bates range, and log each record's authentication. Defuse both landmines: build Tab 5's prior medical shield against the prior-injury line defense counsel pressed at the 02/18/2027 deposition (the 2021 low-back visits) and the “degenerative” MRI reading Keystone first raised on 08/05/2026, and strip the attorney's-set Lien Sheet to what is actually owed. Flag every privileged or settlement item for Atty. Thorne; nothing is exchanged until he approves the set.

| | |
|---|---|
| **Tool / interface** | CMS → Litigation → Exhibit index · Medical Records Requests · CMS → Financial Ledger → Net Sheet → Lien Tracker |
| **Expected output** | A six-tab, C-numbered, Bates-ranged Arbitration Binder with an authentication log, plus an audited Lien Sheet for the attorney's set, routed to Atty. Thorne for the 06/02/2027 exchange. |

**Verification checkpoints**

- [ ] Tab 1: snapshot sheet (claimant John Doe; Harbor Point HP-26-7741, Cardinal State CS-26-20355, each carrier's current contact verified; arbitrator Laura Whitcomb, Esq.; hearing 06/22/2027); fee disclosures with retainer deposits confirmed paid; slot held for the final brief of 06/11/2027, never a draft
- [ ] Threshold exhibits first: Keystone's $10,000 tender, the UM consents, the Limited Release and Robert Smith's dismissal, with both carriers' Coverage Letters (03/02/2026 and 03/09/2026); nothing from the Confidential Mediation Statement
- [ ] Tab 2, arbitration pleadings: the demand under Harbor Point's clause, Cardinal State's joinder, each carrier's 04/05/2027 written position and any Scheduling Order, operative versions only; the tort complaint and answer moved to the attorney's set for Atty. Thorne's exchange decision; the pre-filing draft removed
- [ ] Tab 3: the full, certified RPD-26-018842 (not the public-redacted copy), identifiers redacted as the forum requires, the citation's admissibility flagged for Atty. Thorne; doorbell stills reprinted in color from the native file, chain of custody logged (copy secured 02/19/2026); event data recorder (belt buckled, 11 mph)
- [ ] Tab 4: treatment chart and ledger $14,817.40 tied to certified bills; a certification requested from each provider (Riverton Urgent Care, Riverton Spine & Rehab, Lakeside Orthopedics, Summit Imaging Center, Crescent Pain & Spine, Riverton Drug) and from Riverton Fire (EMS), Riverton PD and Northgate HR, receipt logged; none in 14 days → second request and subpoena flag (Crescent's, requested 05/05/2027, due 05/19); Causation Letter 06/19/2026 flagged: an opinion, not a business record, admitted per the forum's rules; the gap proved by its underlying records, the Gap Explanation Record's synthesis left for the brief
- [ ] Landmine 1, Tab 5: the 2021 records (three low-back chiropractic visits, resolved), the treating providers' own histories and John's 02/18/2027 deposition testimony showing no prior neck complaint, paired with the MRI's “no significant degenerative change at the adjacent levels” and the Causation Letter; if the letter is silent on the 2021 visits, flagged to Atty. Thorne to decide whether to seek a supplemental declaration from Dr. Reyes; the firm's intake questionnaire is privileged: a source, never an exhibit
- [ ] Landmine 2, attorney's set: Lien Sheet stripped of Harbor Point PIP and Summit Imaging (PIP paid Summit's $2,395.00; no PIP reimbursement right, per the 03/02/2026 letter in the threshold record); liens Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00; Crescent holds none
- [ ] Tab 6, wage proof only: Northgate HR letter, 9 shifts × 8 h × $22.00 = $1,584.00; the negotiation ledger (07/20/2026 demand to the executed settlement documents, no session offers) kept in the attorney's set
- [ ] Impasse memo, negotiation ledger and Lien Sheet flagged for Atty. Thorne's privilege and exchange decision, none placed in the exchange set by the CM
- [ ] Master index: C-numbers sequential, Bates ranges match page counts, authentication column complete, forum's evidence rule noted as “confirm with Atty. Thorne”; set approved before the 06/02/2027 exchange

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Exchange on 06/02/2027, 16 days out | Sort into six tabs, apply QC, number and Bates-range | CMS → Litigation → Exhibit index | C-1 onward; ranges match page counts; all four traps handled |
| Lien Sheet lists PIP and Summit Imaging | Reconcile against the PIP payment log, Peach State's EOB and Harbor Point's 03/02/2026 letter | CMS → Financial Ledger → Net Sheet → Lien Tracker | Liens $1,860.00 + $6,105.00 = $7,965.00 |
| Set audited | Route the set and the flagged items to Atty. Thorne | CMS → Tasks → Escalate | Approved, then exchanged by 06/02/2027 |

**Best practices & pitfalls**

- Apply the QC rule the moment a document lands in its tab.
- Pair every damaging record with the record that answers it.
- ⚠️ Pitfall: sorting the folder first and applying QC later.
- ⚠️ Pitfall: conceding a reimbursement right the carrier gave up in writing.
- ⚠️ Pitfall: an internal memo in an exchanged set.

#### 3 · Knowledge Check & CM Summary

Verified in Binder Assembly Verification (taught on Case Flow Day 4) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Sort accuracy | Every document in its tab; all four traps handled |
| 🤖 AI | **15%** | Threshold and numbering | Exhaustion record leads; C-numbers sequential; Bates ranges match page counts |
| 🤖 AI | **15%** | Prior medical shield | 2021 low-back records paired with the MRI read and the Causation Letter |
| 🤖 AI | **15%** | Lien and wage figures | PIP and Summit stripped; $1,860.00 + $6,105.00 = $7,965.00; wages $1,584.00 |
| 🧑‍🏫 Trainer | **20%** | Landmine reasoning | Explains how each trap would have hurt John Doe at the hearing |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | Privilege, exchange and argument routed to Atty. Thorne; no expert opinion sought without his decision |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Put the four red traps on the board, then cover them before anyone sorts. The skill is categorizing, ordering and formatting under pressure, and QC applied while sorting is what is graded.
- Ask the room: “Harbor Point is the other side now. Our attorney's-set Lien Sheet says it is owed $5,000.00. What goes wrong?” Atty. Thorne would work John Doe's net from a reimbursement right Harbor Point gave up in writing on 03/02/2026. The sheet never goes to the arbitrator; it still has to be right.
- On Tab 5, watch for trainees who start arguing causation. The CM pulls and pairs the records; whether to ask Dr. Reyes for a supplemental opinion on the 2021 visits is Atty. Thorne's decision.
- The impasse memo is the privilege test. A trainee who files it in Tab 6 because it explains the history has misunderstood who decides what is exchanged.

---

### 4.1.25 Lien Reduction Verification

> **Knowledge Check** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#18` Lien Negotiations/Reduction: Common Types of Liens · `D3#19` Key Legal Doctrines Used for Reduction · `D3#20` Quantum Meruit Principle — Prior Attorney Liens · `D3#21` Increasing the Client's Net · `D3#22` Auditing the Billing Before Asking for a Discount · `D2#40` Finalized Settlement: Final Lien Mitigation (The “Reduction”)

#### 1 · Visual Layout Description

Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange; question 6 carries a small red PRESSURE chip. Lower half: the CM SELF-SUMMARY on a navy card with white type, three prompts, beside the 1–5 SKILL SCALE as a five-step ladder with six competency rows. A slim right strip: 60/40 stacked bar (AI navy, Trainer orange), UPL a separate red gate chip below it. Between the halves, a LIEN TRACKER STRIP, two rows across four cells headed ASSERTED · AUDITED · REDUCED · IN WRITING: Peach State $1,860.00 · $1,860.00 · $1,240.00 · ✓ and Riverton Spine & Rehab $6,290.00 · $6,105.00 · $4,580.00 · ✓. The trainee checks their own answers against the strip before submitting.

#### 2 · Slide Body — Knowledge verification

1. Classify each claim against John Doe's $40,000 (Peach State, Riverton Spine & Rehab, Harbor Point PIP, Medicare/Medicaid, a prior attorney) as statutory, contractual or none, and rank the liens by reducibility.
2. Peach State is a fully insured group plan. Explain why that matters to reducing its $1,860.00 claim, and who decides what follows from it.
3. Show the math that takes Peach State from $1,860.00 to $1,240.00, name the doctrine behind it, and explain how beating the 14-Day Gap defense with the MRI supports it.

**Best practices & pitfalls**

- Answer with this file's figures: $1,860.00, $6,290.00, $6,105.00, $1,240.00, $4,580.00.
- ⚠️ Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize, in your own words, what you learned about reducing the liens on John Doe's file: the principles, not the clicks.
- Articulate your strategy: with both liens resolved, what is the next action before the 10/22/2026 disbursement, and why is it the right one?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Classifying liens as statutory or contractual and ranking them by reducibility | ○ | ○ | ○ | ○ | ○ |
| Matching a reduction doctrine to a lien and showing its math | ○ | ○ | ○ | ○ | ○ |
| Auditing a provider ledger before asking for a reduction | ○ | ○ | ○ | ○ | ○ |
| Calculating a pro-rata distribution from a limited fund | ○ | ○ | ○ | ○ | ○ |
| Securing written Payoff Letters and updating the Lien Tracker and Net Sheet | ○ | ○ | ○ | ○ | ○ |
| Holding the authority line in lien negotiation | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (5 questions):

1. Why can Peach State's $1,860.00 claim be argued down further than a self-funded ERISA plan's usually can?  
   Health Plans have no reimbursement right against an injury recovery · It paid at a contract rate, so it has no lien at all · **✓ It is a fully insured plan, so state law, not ERISA preemption, generally governs its reduction** · PIP paid first, so the plan's claim is waived  
   *A self-funded ERISA plan answers to federal law and its own terms and is very hard to reduce. A fully insured plan is generally subject to state insurance law, where made-whole and common-fund arguments can apply. Which to argue is Atty. Thorne's call.*
2. Riverton Spine & Rehab's LOP ledger shows $6,290.00. Before asking for any reduction, the Case Manager:  
   **✓ Audits the ledger against the visit records and has the 05/04/2026 duplicate corrected to $6,105.00** · Asks for 50% off the $6,290.00 in the interest of global resolution · Tells John Doe the bill is inflated and he need not pay it · Pays the full balance from trust to keep the provider relationship  
   *Corrections first, reductions second. 34 lines × $185.00 = $6,290.00, but the records show 33 visits; the reduction is negotiated from the audited $6,105.00, never from an inflated bill.*
3. Had only the $10,000 BI been recovered, $6,179.92 would be left after fee and costs. Shared pro rata, Riverton Spine & Rehab's $6,105.00 lien would receive:  
   $6,105.00 · $4,580.00 · $1,443.15 · **✓ $4,736.77**  
   *Riverton holds $6,105.00 of the $7,965.00 in audited liens (about 76.65%), so it takes $6,179.92 × $6,105.00 ÷ $7,965.00 = $4,736.77; Peach State takes $6,179.92 × $1,860.00 ÷ $7,965.00 = $1,443.15. John Doe would net nothing, which is why reductions matter.*
4. Riverton Spine & Rehab's billing manager agrees on a call to accept $4,580.00. The reduction is final when:  
   The call ends with a verbal yes · **✓ Atty. Thorne approves it and the provider's signed Payoff Letter accepts $4,580.00 as full and final satisfaction** · The Case Manager logs the call in the Communications Log · John Doe agrees to the figure  
   *A verbal reduction is not a reduction. No Payoff Letter, no payment: the letter must state full and final satisfaction, and the compromise needs Atty. Thorne's approval.*
5. Peach State paid $1,860.00 on Crescent Pain & Spine's $3,400.00 bill for the 05/15/2026 injection. Building the lien inventory, who can pursue John Doe for the other $1,540.00?  
   Crescent Pain & Spine, as an unpaid provider balance · Peach State, as part of its reimbursement claim · Harbor Point, through PIP · **✓ Nobody: Crescent took Peach State's contract rate and cannot balance-bill, so the $1,540.00 is recorded as not owed**  
   *The lien is what the plan paid, not what was billed: Peach State asserts $1,860.00. Crescent's $1,540.00 write-off ($3,400.00 – $1,860.00) is a contract-rate adjustment, recorded as not owed. Harbor Point's PIP has no reimbursement right (03/02/2026).*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Classification and doctrine | Liens classified and ranked; fully insured status tied to state law; doctrines named correctly |
| 🤖 AI | **20%** | Lien math | $1,860.00 – $620.00 = $1,240.00; $1,443.15 + $4,736.77 = $6,179.92; $6,105.00 after the audit |
| 🤖 AI | **15%** | Written-confirmation steps | Atty. Thorne's approval, the signed Payoff Letter and the ledger update all named |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Escalation to Atty. Thorne identified wherever a figure, a doctrine or a validity question arises |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 2 is the keystone. A trainee who answers “state law applies, so we argue made whole” has made Atty. Thorne's decision for him; re-teach the line before moving on.
- Question 6 is the pressure scenario. The right answer escalates to Atty. Thorne before any check issues, re-checks how “no prior attorney” was verified, on Atty. Thorne's instruction requests the lawyer's engagement terms and time records in writing, and never treats “one-third” as owed: a discharged lawyer is generally owed the reasonable value of his work, if anything. The disputed amount stays in trust until the claim is resolved (confirm the governing trust rule); the undisputed shares go out only on Atty. Thorne's approval.
- Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.
- UPL is a gate: a strong score does not survive an ethics breach.

---

### 4.1.26 Final Accounting Check

> **Knowledge Check** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Final Accounting Check (`d3m4`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#37` The Execution: The Dismissal (The “Court” Filing) · `D2#41` Skill Building: BI Settlement — Caught in an Operational Pincer Movement · `D3#23` The Net Sheet: Purpose of a Combined BI/UM Net Sheet · `D3#24` The Net Sheet: Stream 1 (BI) and Stream 2 (UM/UIM) · `D3#27` Key Takeaway — The Value of a Case Manager · `D3#33` Final Case Reconciliation Checklist: Net Sheet (The “Money Trail”) · `D3#34` Final Case Reconciliation Checklist: Proof of Delivery/Completion · `D3#35` Final Case Reconciliation Checklist: Compliance & Identity Verification · `D3#36` Final Case Reconciliation Checklist: The Internal “Closing Memo” · `D3#37` Final Case Reconciliation: Retention & Disposition Schedule · `D3#38` Skill Building: Closing a Case — John Doe v. Apex Delivery Final Tasks

#### 1 · Visual Layout Description

Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange; beside it, four stacked chips under the heading BEFORE ARCHIVE (MONEY TRAIL · PROOF OF DELIVERY · COMPLIANCE & IDENTITY · CLOSING MEMO), each with an empty tick box. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, beside the 1–5 SKILL SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar.

#### 2 · Slide Body — Knowledge verification

1. Take John Doe's $40,000.00 to his $20,359.92 net, stream by stream. What does each stream carry for fee, costs and liens, and why is the split 25% / 75%?
2. Name the four document sets that must be in the file before it is archived, the item on John Doe's file that satisfies each, and how long the closed file is kept.
3. The Trust Ledger reads $0.00 after the 10/22/2026 disbursement. Which records prove it, and what would a balance left in trust tell you?

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Ledger at $0.00 (10/22/2026) | Assemble the money trail: every check itemized with its transaction ID, and the zero-balance report | CMS → Financial Ledger → Trust | Bank statement, trust journal and client ledger agree at $0.00, only after all five checks clear |
| Satisfactions and receipt returned | File proof of delivery, the payer-disclosure confirmation and a current W-9 | CMS → Documents | All four sets present before archive |
| Disbursement posted and satisfactions in | Draft the closing letter to John Doe for Atty. Thorne's signature: what was paid, to whom, and the satisfactions received | CMS → Documents → Outgoing | Signed by Atty. Thorne and sent before the file is archived |
| Closing memo written (10/30/2026) | Tag every document by type and docket the disposition date | CMS → Case Summary · CMS → Calendar | Disposition review set 7 years from closing |

**Best practices & pitfalls**

- The four sets before archive: the money trail (itemized checks, transaction IDs, zero balance); proof of delivery (John Doe's signed receipt, lien satisfactions); compliance and identity (a current W-9, not the intake copy, for any 1099 reporting; the payer-disclosure confirmation); the closing memo.
- The payer-disclosure confirmation is John Doe's signed statement that he has disclosed every provider, every bill and every payer (PIP $5,000.00, Peach State $1,860.00, his own $312.40), so every reimbursement claim is known and the releases' indemnity promise can be kept. It does not say nothing else paid: other sources did, and recovering those bills is generally allowed (collateral source; confirm the governing rule).
- Write the closing memo so a stranger understands the file in two minutes: how it started (a passenger, a 14-Day Gap, a $40,000 stack), how it ended, every discrepancy explained, every exception recorded (or “none granted”). Note that the property-damage claim runs separately and is not closed by it.
- A completion certificate belongs only to repair disbursements: the Civic's repair was paid by Keystone PD directly to the shop and never passed through trust.
- Zero balance proved three ways: the bank statement, the trust journal and John Doe's client ledger agree, and only after all five checks have cleared the bank. An uncashed check is followed up and its funds stay in trust until it clears (confirm the governing reconciliation rule).
- Retention: tag each document by type and apply the firm's schedule (on this training file, 7 years from closing); where a stricter rule applies, it controls. Never destroy financial records before the retention date.
- ⚠️ Pitfall: archiving without John Doe's signed acknowledgment of receipt.
- ⚠️ Pitfall: telling John Doe a late bill is “not our problem.”

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize, in your own words, what you learned closing John Doe's file: the principles behind the Net Sheet, the release audit and the Trust Ledger, not the clicks.
- Articulate your strategy: the ledger is at $0.00 on 10/22/2026. What is your next action before the 10/30/2026 closing memo, and why is it the right next action rather than something else?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Building a dual-stream Net Sheet that ties to the Trust Ledger | ○ | ○ | ○ | ○ | ○ |
| Proving each lien's asserted, audited and reduced figures with Payoff Letters | ○ | ○ | ○ | ○ | ○ |
| Auditing a release's parties, claims and indemnity before the client signs | ○ | ○ | ○ | ○ | ○ |
| Running a trust disbursement through its conditions precedent to $0.00 | ○ | ○ | ○ | ○ | ○ |
| Completing the four-set reconciliation, the closing memo and the retention schedule | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary on releases, money and the client's questions | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (9 questions):

1. Keystone's 08/14 draft release covered Robert Smith, Keystone and “all other persons, firms, corporations and insurers.” What was the danger?  
   It left out the non-admission-of-liability clause · **✓ It would also have released Harbor Point and Cardinal State: $30,000 of the stack** · It had no notary block · It released only the bodily-injury claim  
   *Harbor Point and Cardinal State are insurers. The catch-all line would have released both UM claims; flagged to Atty. Thorne, it was revised to a Limited Release of Robert Smith and Keystone, signed 08/28/2026.*
2. Which of these is a payable line on John Doe's Lien Tracker?  
   Harbor Point PIP, $5,000.00 · Crescent Pain & Spine's written-off balance · **✓ Riverton Spine & Rehab, $4,580.00** · Riverton Spine & Rehab's duplicate 05/04/2026 visit  
   *PIP has no reimbursement right (Harbor Point, 03/02/2026); Crescent wrote off its balance and cannot balance-bill; the duplicate was audited out. Only the reduced liens are paid: Riverton Spine & Rehab $4,580.00 and Peach State $1,240.00.*
3. When was the first trust check cut on John Doe's settlement, and why not earlier?  
   09/04/2026, when Keystone's check arrived · 10/13/2026, when the last check arrived · 10/30/2026, with the closing memo · **✓ After the last funds cleared (10/20) and John Doe signed the Settlement Statement (10/21): disbursement 10/22/2026**  
   *Nothing is disbursed against uncleared funds or before the client has signed the statement. All three checks had cleared by 10/20 (the last, Cardinal State's, deposited 10/13), John Doe signed 10/21, and Atty. Thorne signed the checks 10/22.*
4. How are the $486.75 in case costs handled on John Doe's Net Sheet?  
   **✓ Receipted, then split pro rata 25% / 75%: $121.69 BI and $365.06 UM** · Charged in full to each stream · Absorbed by the firm because no suit was filed · Taken out of the lienholders' payments  
   *Every cost needs a receipt and is charged once. This file allocates costs to the streams pro rata to gross: 25% of $486.75 = $121.69 on BI, and the remaining $365.06 on UM.*
5. The Net Sheet shows John Doe netting $20,359.92. Lakeside Orthopedics noted possible repeat ESIs ($3,400–$6,800) ahead. Before John Doe signs, the Case Manager:  
   Holds $6,800.00 of his net in trust to cover the injections · Tells John Doe the net is enough to cover future care · **✓ Flags it to Atty. Thorne: the settlement is full and final and no carrier pays more, so he has that conversation with John Doe** · Adds the injections to Peach State's lien so the plan pays them later  
   *The CM builds and explains the arithmetic but never says whether the net is enough. Future medical was narrated, never in the Specials; with a full and final settlement nothing more comes from Keystone, Harbor Point or Cardinal State. The flag goes to Atty. Thorne.*
6. John Doe's Trust Ledger reads $0.00 after the 10/22/2026 disbursement. When can the file be marked Archived?  
   Now: a zero balance means every payee was paid · Once Atty. Thorne has signed the five checks · **✓ Once all four document sets are verified present: money trail, proof of delivery, compliance and identity, and the closing memo** · Once the 7-year retention period has run  
   *$0.00 starts the close; it does not finish it. The file is archived only when an outsider could trace every dollar from it: confirmation numbers and the three-way zero-balance proof, the lien satisfactions and John Doe's signed receipt, his payer disclosure and a current W-9, and the closing memo of 10/30/2026.*
7. After the closing letter, a statement arrives asking John Doe for a balance on his accident treatment. He calls, upset. What does the Case Manager do?  
   Tells him the file is closed, so it is not the firm's problem · Tells him he owes it and should pay it to protect his credit · **✓ Verifies the bill against the ledger, EOBs and Payoff Letters, routes it to Atty. Thorne the same day, and tells John Doe what is being done and when he will hear back** · Pays it from the trust account to keep him satisfied  
   *Verify, classify (a lien we missed, or a bill nobody owes), route the same day, and keep John Doe informed. The release's indemnity clause makes a missed lien serious, but whether he owes the bill, and who answers for it, is Atty. Thorne's call; the trust account is at $0.00 and holds nothing to pay it from.*
8. On 10/14/2026 Vance & Kettering claims a charging lien and asks the case manager to confirm a fee split by 10/16. What does the Case Manager do?  
   Confirm a smaller split to keep the 10/22 disbursement on time · **✓ Log the notice, route it to Atty. Thorne the same day, send nothing to the firm, and hold the disputed amount on his instruction** · Email Vance & Kettering that the lien is invalid · Ignore it, because John Doe never hired them  
   *Validity, any response and any fee division are Atty. Thorne's. The Case Manager logs, routes, holds what he says to hold ($6,666.67), and builds the factual record.*
9. Which finding belongs in the Case Manager's evidentiary packet on the asserted lien?  
   “The lien is void and unenforceable.” · **✓ “The 07/27/2026 agreement is signed only by Margaret Doe; John Doe's line is blank, and the firm's record shows 0.6 hours with her.”** · “Mr. Vance is entitled to quantum meruit for 0.6 hours.” · “John Doe should sue his mother's lawyer.”  
   *The packet states facts tied to documents: the signer, the dates against the 02/09/2026 engagement, the work actually done. What those facts mean, quantum meruit included, is Atty. Thorne's call.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Net Sheet accuracy | Both streams and the total reach $20,359.92; 25% / 75% explained as pro rata to gross |
| 🤖 AI | **15%** | Reconciliation sets | Four sets named with this file's items; 7-year retention from closing |
| 🤖 AI | **15%** | Closing and dismissal doctrine | Zero-balance proof; gap answered by the MRI and Dr. Reyes's Causation Letter; dismissal with prejudice only where a suit is pending |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Escalation to Atty. Thorne identified wherever authority or legal judgment is required |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 1 is the keystone. A trainee who cannot carry $40,000.00 to $20,359.92 down both streams without notes has not finished the Net Sheet; re-teach before moving on.
- Put question 6 to the room before they write: “Is this a lien we missed, or a bill nobody owes?” Peach State's EOB shows the $1,540.00 ($3,400.00 – $1,860.00) as a contractual write-off Crescent cannot balance-bill. Model answer: verify the bill and its link to the accident against the ledger and the EOB, route it to Atty. Thorne, ask Crescent in writing to correct its account, and tell John Doe today what you are doing and when he will hear back. Whether he owes it is Atty. Thorne's to say.
- Question 7 is the operational pincer. The right answer stops, documents every contact and escalates at once; any request for more time goes to Keystone in writing on Atty. Thorne's instruction. A deadline is never a reason to let John Doe sign a release that reaches $30,000 of UM coverage.
- Compare each self-rating with the score, and remember UPL is a gate: a strong score does not survive an ethics breach.

---

### 4.1.27 ADR & Calendar Compliance Check

> **Knowledge Check** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with ADR & Calendar Compliance Check (`d4m2`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D5#28` Master Timeline & Deadline Calculations · `D4#18` Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules · `D4#17` Arbitration: Operational Mindset — From Compromise to Trial-Ready · `D4#16` Case Phase: Arbitration — The Anatomy of a PI Arbitration · `D4#20` Ethics & Boundaries: What You Can and Cannot Do at Hearings (UPL) · `D4#5` Mediation Protocols for CMs: Logistics & Scheduling · `D2#33` The Execution: The Release of All Claims (The “Exit” Document) · `D3#19` Key Legal Doctrines Used for Reduction

#### 1 · Visual Layout Description

The standard knowledge-check split: cream question panel above, navy CM Self-Summary card below-left with the 1–5 skill ladder below-right, and the 60/40 strip with the separate red UPL gate on the far right. Unique to this module: between the question panel and the summary card, a slim full-width HARD-DATE RIBBON of the module's computed dates as mono pills (01/04/2027 · 03/11/2027 · 06/02/2027 · 06/11/2027 · 11/05/2027 · 02/04/2028), each rolled date with a small arrow showing its direction (01/04/2027 forward; 06/11/2027, 11/05/2027 and 02/04/2028 back), and 03/11/2027 and 06/02/2027 marked NO ROLL, so the trainee checks direction before answering.

#### 2 · Slide Body — Knowledge verification

1. Defendant's discovery to John Doe was served on his counsel, Atty. Thorne, by U.S. mail on 12/01/2026, and the SOL is 02/06/2028, a Sunday. Compute his response date step by step; give the SOL's internal hard date and internal filing cutoff with the arithmetic; explain which way a count moves off a weekend going forward and which way going backward, using that response date and the brief for the 06/22/2027 hearing; and state what can happen to a Request for Admission left unanswered.
2. Harbor Point’s UM negotiation has reached impasse. Name the two resolution routes a UM/UIM dispute can take, say what decides which one governs, and explain where an Insurance Bad Faith action sits in relation to them. Then say why the Bluewater Auto policy on Margaret Doe’s Civic is not a route on this file.
3. Place mediation and arbitration on the timeline: name what puts each of them before a filing and what puts each of them after one, then say where John Doe's two sessions landed and why. Finish with the sentence you would say to him to explain non-binding, and the sentence for binding.

**Best practices & pitfalls**

- Show the arithmetic for every date; an answer without it can't be checked.
- ⚠️ Pitfall: answering the arbitrator's question correctly, and so answering it at all.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize what you learned about hard rules and the two forums on this file: the principles, not the clicks.
- Articulate your strategy: it is 04/05/2027 and the arbitration has just been invoked. What is your next action, and why that one before anything else?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Computing court deadlines: trigger day, mail days, weekends | ○ | ○ | ○ | ○ | ○ |
| Counting backward from a hearing without rolling forward | ○ | ○ | ○ | ○ | ○ |
| Setting the SOL's internal hard date and filing cutoff | ○ | ○ | ○ | ○ | ○ |
| Auditing a calendar and ranking errors by risk | ○ | ○ | ○ | ○ | ○ |
| Distinguishing mediation from binding arbitration on a live file | ○ | ○ | ○ | ○ | ○ |
| Telling a first-party UM claim apart from a third-party BI claim | ○ | ○ | ○ | ○ | ○ |
| Reading a UM resolution route off the state law and the policy clause | ○ | ○ | ○ | ○ | ○ |
| Placing each forum before or after a filing, and explaining non-binding and binding in plain words | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL line at a mediation or a hearing | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (14 questions):

1. Defendant's discovery to John Doe was served on his counsel, Atty. Thorne, by U.S. mail on 12/01/2026. As configured for this training file, his responses are due:  
   12/31/2026 · 01/03/2027 · **✓ 01/04/2027** · 01/13/2027  
   *Exclude the trigger day: 30 days → 12/31/2026; add 3 for mail → 01/03/2027, a Sunday; counting forward, it moves to Monday 01/04/2027. 01/13/2027 is when Robert Smith's responses to our e-served discovery are due.*
2. The SOL on John Doe's file is 02/06/2028, a Sunday. The firm's internal filing cutoff is:  
   **✓ 11/05/2027 (Fri)** · 11/08/2027 (Mon) · 02/04/2028 (Fri) · 11/06/2027 (Sat)  
   *The internal hard date is 02/04/2028, the Friday before the Sunday. Ninety days before it is 11/06/2027, a Saturday; counting backward moves to the earlier business day, 11/05/2027. 11/08/2027 is what you get by counting from the Sunday or rolling forward.*
3. The arbitration brief for the 06/22/2027 hearing is due 10 days before. Ten days before is Saturday 06/12/2027. You docket:  
   06/14/2027 (Mon) · 06/12/2027 (Sat) · **✓ 06/11/2027 (Fri)** · 06/02/2027 (Wed)  
   *A backward count that lands on a weekend moves to the earlier business day. Rolling it forward to 06/14 files the brief late; 06/02 is the exhibit exchange.*
4. At the 06/22/2027 hearing, Laura Whitcomb, Esq. asks you directly about a Riverton Spine & Rehab bill. You:  
   Answer briefly: you audited that bill and know it best · Stay silent and wait for Atty. Thorne to notice · Offer to email her the audit after the hearing · **✓ Say you are the Case Manager providing administrative assistance, defer to Atty. Thorne on the record, and hand him the document**  
   *Speaking to the merits before the arbitrator is the unauthorized practice of law, even when your answer is right. Defer politely and put the document in counsel's hands.*
5. The Scheduling Order says mediation is to be “completed by 03/31/2027.” The re-keyed calendar shows “Mediation session 03/31/2027.” The correct fix is:  
   Leave it: the order names the date · **✓ Re-enter it as a deadline, “completed by 03/31/2027”, with a task to collect 3–4 windows from Atty. Thorne, John Doe and opposing counsel before the mediator's office is contacted** · Call Hon. Carla Benton's office and book 03/31/2027 · Roll it forward to 04/01/2027 to leave time for the session  
   *Read each verb in the order: “completed by” sets when the session must be over, not when it is held. Windows are gathered from every party before the neutral hears from you; the session was held 03/18/2027, inside the deadline.*
6. Harbor Point offers $8,000 against its $20,000 Host UM limit and will not move. Before anything is calendared, the Case Manager:  
   Drafts a civil complaint against Harbor Point, the way the BI claim would have gone to suit · **✓ Reads the governing state law and Harbor Point’s own dispute-resolution clause, quotes the clause to Atty. Thorne and asks which route governs** · Files a Demand for Arbitration, since UM policies normally require arbitration · Tells Marcus Bell the offer is unreasonable and that bad faith is being considered  
   *The route out of a UM impasse is read off the governing state law and the policy the claim is made under, never chosen by reflex or by habit. The clause goes to Atty. Thorne quoted, not interpreted, and the decision is his.*
7. Which of these is a first-party claim on John Doe’s file?  
   The BI claim against Keystone Mutual for Robert Smith · The Keystone PD claim on the Civic · **✓ The Host UM claim against Harbor Point** · The Peach State Health Plan reimbursement claim  
   *A first-party claim is made against coverage John Doe himself can call on under his own contract: Host UM (Harbor Point, as an occupant of Kevin Alvarez’s Escape) and Relative UM (Cardinal State, as a resident relative). Keystone’s BI and PD claims are third-party claims against the at-fault driver’s carrier.*
8. An Insurance Bad Faith lawsuit differs from the UM claim itself because:  
   It is heard by the same arbitrator at the same hearing · It replaces the UM claim once arbitration is demanded · **✓ It is a separate court action for the carrier’s unreasonable handling, and can reach beyond the UM policy limit** · It is the Case Manager’s to initiate once an offer is clearly too low  
   *Bad faith sits off the UM dispute’s fork: a separate suit about how the carrier handled the claim, which is why it can reach above the limits. You record the handling dates as facts; whether the conduct is actionable is Atty. Thorne’s opinion alone.*
9. John Doe asks when mediation and arbitration happen in a personal injury case. The accurate answer is:  
   Only after a lawsuit is filed · Only before a lawsuit is filed, as part of the demand · **✓ Either before filing or after it, depending on the process, the court's local rules and how the negotiations go** · Only when the trial date has already been set  
   *Neither forum has one fixed place on the timeline. Pre-litigation mediation follows completed treatment and the demand when both sides want to avoid court costs; most personal injury mediations are post-filing and many are court-ordered during discovery. Arbitration comes before filing when a signed clause compels it, and after filing when the parties agree to leave the court system.*
10. Harbor Point and Cardinal State dispute damages and the file goes to binding arbitration on 06/22/2027. Laura Whitcomb, Esq. issues her award. In plain words to John Doe, that award is:  
   A recommendation either side may accept or reject · Non-binding until he signs it, as at mediation · **✓ Final and enforceable like a court order, with court review on narrow grounds only** · Automatically reheard by a jury if he disagrees  
   *Binding means the decision is final and enforced like a court order; courts review it on narrow grounds only (some policies or statutes allow a trial de novo — confirm the governing rule). Mediation is the non-binding one: both sides must agree and nobody is forced to settle. What the award means for his recovery is Atty. Thorne's to explain, not yours.*
11. The Notice of Mediation sets John Doe's session for 03/18/2027 (Thu); the statement and binder are due 7 days before, and the binder QC runs 7 days before that. You calendar:  
   **✓ Statement and binder 03/11/2027 (Thu); binder QC 03/04/2027 (Thu)** · Statement and binder 03/24/2027 (Wed); binder QC 03/17/2027 (Wed) · Statement and binder 03/31/2027 (Wed); binder QC 03/24/2027 (Wed) · Statement and binder 03/12/2027 (Fri); binder QC 03/05/2027 (Fri)  
   *Count back from the session, its trigger: 03/18 − 7 = 03/11/2027, a Thursday, so no roll; 03/11 − 7 = 03/04/2027. Counting forward from the session puts the binder after it, and 03/31/2027 is the order's completion deadline, not a binder date.*
12. While calendaring the 03/18/2027 mediation, you note that Harbor Point's and Cardinal State's policies each require their written consent before any settlement with Keystone. What do you do?  
   Nothing until the session: consent only matters if Keystone actually tenders · Write to both UM carriers today asking them to pre-approve any BI settlement · **✓ Flag the requirement to Atty. Thorne with the 30-day consent window, and let him decide whether and when the carriers are notified** · Tell John Doe he cannot accept a BI offer at mediation without the carriers' approval  
   *A BI release signed without the UM carriers' written consent can forfeit the $30,000 behind it. The CM puts the requirement and the arithmetic in front of Atty. Thorne; contacting the carriers and explaining the consequence to John Doe are his calls.*
13. Certified records for the Arbitration Binder must be in hand when binder QC opens on 05/17/2027 (Mon), and custodians are given 14 days to respond. What is the last day to send the requests?  
   **✓ 05/03/2027 (Mon)** · 05/19/2027 (Wed) · 05/31/2027 (Mon) · 06/02/2027 (Wed), the exhibit exchange  
   *Count a lead time back from the internal step that needs the item: 05/17/2027 − 14 days = 05/03/2027, a Monday. Counting from the 06/02/2027 exchange leaves no time to sort, QC and route the set to Atty. Thorne, and a request sent later arrives after the binder is being built.*
14. On 04/26/2027 the master calendar still shows No. 26-CV-04417's discovery close (05/28/2027), pretrial conference (08/12/2027) and trial calendar (09/13/2027). Robert Smith was dismissed after the 03/18/2027 mediation. What does the Case Manager do?  
   Delete all three entries, because the suit is over · Leave them as they are and say nothing · **✓ Keep them, mark them “Robert Smith dismissed: confirm vacated”, and ask Atty. Thorne in writing which stay live** · Call the court clerk and ask for the dates to be vacated  
   *What the dismissal did to the court's schedule is a legal question for Atty. Thorne. Deleting guesses at the answer; leaving the entries unmarked has the team chasing dates that may not exist. Keep, mark and ask; the SOL hard date 02/04/2028 and the 11/05/2027 cutoff stay unchanged.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Deadline arithmetic | 01/04/2027 with the mail days and the Sunday; brief 06/11/2027 counted backward |
| 🤖 AI | **10%** | SOL cutoffs | 02/04/2028 and 11/05/2027, arithmetic shown |
| 🤖 AI | **15%** | Forum logistics | Windows, fee schedule, retainer and layout owned before 06/22/2027; bench directives logged as given and calendared the same day; each forum placed correctly before or after a filing |
| 🤖 AI | **10%** | UM resolution routes | Mandatory arbitration vs. a civil suit against the carrier, decided by the state law and the policy clause; bad faith separate and above the limits; why Margaret’s Bluewater policy is no route (no UM: rejected in writing 03/14/2024), John owning no car |
| 🤖 AI | **5%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | The hearing answer defers to Atty. Thorne on the record; the mediation answer escalates rather than accepts |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Run question 5 live: play Laura Whitcomb, Esq. and put the bill question to a trainee across the table. Grade the first sentence they say.
- Ask the room: “Which single date on this file would you check twice, and why?” Expect the RFAs or the SOL cutoffs; push for the reasoning.
- Question 3 is the direction test. A trainee who lands on 06/14/2027 has memorised the weekend rule without its direction; re-teach before the binders, which count back from the same hearing.
- UPL is a gate, as on every day: a strong score does not survive an answer that speaks for John Doe at the hearing or tells him whether to take a number.

---

### 4.1.28 Binder Assembly Verification

> **Knowledge Check** · Day 4 — Reductions, lien negotiation & ADR · Module 4: Reductions, Lien Negotiation & ADR · scored with Binder Assembly Verification (`d4m3`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#7` Mediation Binder Section 1: Executive Summary & Administrative Details · `D4#9` Mediation Binder Section 3: Core Pleadings (The Legal Framework) · `D4#10` Mediation Binder Section 4: Key Evidence & Liability Exhibits · `D4#13` Mediation: Quality Assurance & Logistics Auditor · `D4#15` Skill Building: The LSH Critical Thinking Challenge — The Pre-Mediation Audit · `D4#21` Arbitration Binders: Section 1 — The Arbitration Submissions · `D4#24` Arbitration Binders: Section 4 — Proving Bodily Accident Medical Damages · `D4#26` Arbitration Binders: Section 6 — Economic Losses & Lien Reconciliations · Newly authored: exhibit numbering, Bates ranges and the master index as the one source of truth · Newly authored: authentication, business-records certifications, relaxed evidence rules in arbitration, and mediation confidentiality at the hand-off

#### 1 · Visual Layout Description

The standard knowledge-check split: the question panel on the warm cream card with the orange ruled border, questions numbered in orange; below a full-width orange hairline, the CM SELF-SUMMARY on a navy card with its three prompts, beside the 1–5 SKILL SCALE ladder with the competency rows beneath. One addition above the questions: two slim binder spines side by side, SIX SECTIONS · MEDIATION and SIX TABS · ARBITRATION, joined by a single navy bar, MASTER INDEX, with a VERIFIED stamp that turns orange only when both spines are checked. Far right, the 60/40 split as a stacked bar, with UPL as a separate red gate chip below it.

#### 2 · Slide Body — Knowledge verification

1. Name the six sections of John Doe's Mediation Binder in order, with one document from this file that belongs in each.
2. What does the master index record for every exhibit, and why is the CMS index, not the printed binder, the one source of truth?
3. The 11/12/2026 answer pleads that John Doe was unbelted. Which section tells you that defense is in play, and which exhibits answer it?

**Best practices & pitfalls**

- Answer with this file's exhibits, dates and figures, not general rules.
- ⚠️ Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize what you learned about building a binder an attorney can work from at speed: the principles, not the clicks.
- Articulate your strategy: the exchange set is with Atty. Thorne for approval. What is your next action, and why is it the right one rather than something else?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Indexing exhibits: numbering, Bates ranges and a master index | ○ | ○ | ○ | ○ | ○ |
| Assembling a six-section Mediation Binder | ○ | ○ | ○ | ○ | ○ |
| Running a pre-mediation audit of the ledger and the liens | ○ | ○ | ○ | ○ | ○ |
| Assembling a six-tab Arbitration Binder with its QC rules | ○ | ○ | ○ | ○ | ○ |
| Authenticating records and tracking business-records certifications | ○ | ○ | ○ | ○ | ○ |
| Leaving argument, exchange and privilege to Atty. Thorne | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (7 questions):

1. The 11/12/2026 answer pleads that John Doe was unbelted. Which exhibits in Section 4 of the Mediation Binder answer it?  
   **✓ The event data recorder (belt buckled) and the EMS Run Report** · The MRI read and Dr. Reyes's Causation Letter · The Police Report's citation and Ruth Calloway's statement · The Northgate Attendance Record and the 02/07/2026 pharmacy receipt  
   *The Escape's event data recorder shows the front-passenger belt buckled, and the EMS report records a “restrained front-seat passenger”. Ruth Calloway, the doorbell video and the report answer the out-of-turn allegation; the MRI and the Causation Letter answer causation.*
2. After the 06/02/2027 exhibit exchange, a certified record you requested finally arrives. What is the right indexing move?  
   Send it straight to the arbitrator so it still counts · Slip it into Tab 4 behind the MRI without a number · Renumber the set in date order and re-send the index to both carriers · **✓ Give it the next exhibit number and Bates range, and route it to Atty. Thorne**  
   *Exhibit numbers are never reshuffled once a set is in other hands, and the CMS master index changes first. An exhibit not exchanged on time may be excluded, so offering it late is Atty. Thorne's decision under the forum's rules.*
3. Why does Tab 5 of the Arbitration Binder include John Doe's 2021 chiropractic records, which the carriers could use against him?  
   Records we include cannot be used by the other side · **✓ So the arbitrator meets them in context: a different region, resolved, paired with the MRI** · Every medical record a client has ever had must be exchanged · To record the Case Manager's written opinion that the prior low-back visits are irrelevant  
   *The prior medical shield answers the “pre-existing degenerative” argument before it is made: three low-back visits (not neck) that resolved, no prior neck complaint, paired with the MRI's “no significant degenerative change at the adjacent levels” and the Causation Letter. What is argued from it is Atty. Thorne's call.*
4. The pre-demand audit left the billed-or-paid choice on Crescent Pain & Spine's $3,400.00 bill to Atty. Thorne; Peach State paid $1,860.00 at its contract rate. Building the Mediation Binder, what does the audited Lien Sheet show?  
   Crescent $3,400.00 and Peach State $1,860.00 · Crescent $1,540.00 and Peach State $1,860.00 · **✓ Peach State's $1,860.00 reimbursement claim only: Crescent wrote off the rest and cannot balance-bill** · Nothing: the bill is already counted in the Specials  
   *Cross-reference every provider balance against what the plan already paid (its EOB). Peach State's contract payment satisfied the bill and Crescent wrote off the other $1,540.00 (the $3,400.00 bill less the $1,860.00 paid), so Crescent holds no lien; listing both counts one bill twice against John Doe's recovery.*
5. Sorting the unsorted folder for the 06/22/2027 Arbitration Binder, you find the 09/08/2026 impasse memo to Atty. Thorne. Where does it go?  
   **✓ Flagged for Atty. Thorne's privilege and exchange decision, and kept out of the exchange set** · Tab 6, because it explains the negotiation history · Tab 1 with the submissions, since it shows BI was not paid · Tab 2 with the arbitration pleadings  
   *An internal memo in an exchanged set cannot be unsent. The CM flags; Atty. Thorne decides what is withheld as privileged and what is exchanged. The BI exhaustion threshold is proved with executed documents: Keystone's tender, the UM consents, the Limited Release and Robert Smith's dismissal.*
6. Building Tab 5's side-by-side comparison, which line belongs in the Case Manager's work product?  
   “The 2021 condition was not degenerative, so the herniation is new.” · **✓ “2021: three chiropractic visits (05/04–05/18/2021) for low-back stiffness, resolved. MRI 03/13/2026, Dr. Helen Park: ‘no significant degenerative change at the adjacent levels’.”** · “The collision aggravated John Doe's prior back condition.” · “John Doe is an eggshell plaintiff and recovers in full.”  
   *The Case Manager states dated facts in the records' own words. Whether the injury is new, degenerative or an aggravation is a medical opinion or Atty. Thorne's argument, and the eggshell rule is his to argue under the governing law.*
7. On a typical file, the consistency audit finds one provider's intake form that contradicts the rest of the client's prior history. What does the Case Manager do?  
   Correct the form so it matches the other records · Leave the form out of the Arbitration Binder · Ask the client to sign a corrected form · **✓ Flag it to Atty. Thorne with the conflicting records attached, and change nothing**  
   *A mismatch is a credibility question only counsel can decide how to handle. Altering, dropping or re-signing a record could look like concealment; the Case Manager flags it, dated, with both records attached.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Section and tab recall | Six mediation sections and six arbitration tabs in order, with this file's documents |
| 🤖 AI | **15%** | Indexing and evidence | Master index fields, one source of truth, business-records certification, “confirm the forum's rules” |
| 🤖 AI | **20%** | File accuracy | Pleaded defenses and their exhibits; the $10,000 tender as the threshold; Peach State's $1,860.00 as the only claim on the Crescent bill |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slides |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Argument, exchange and privilege decisions reserved to Atty. Thorne |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open by having each trainee put their two master indexes side by side. This check verifies the binders they built, not their memory of the slides.
- Ask the room: “Which document would hurt John Doe most if it were missing from these binders, and which would hurt most if it were included?” The usual pair is the Causation Letter and the impasse memo; make them say why.
- Question 7 is the pressure scenario. The right answer requests the missing records and a certification covering all 33 visits at once, tells Atty. Thorne that evening, and leaves to him how the exchange is handled. It never exchanges a ledger that its records no longer support.
- Compare each self-rating with the score. UPL is a gate: a strong score does not survive a privileged memo in an exchanged set.

---
