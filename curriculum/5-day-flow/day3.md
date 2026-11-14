# Case Flow Day 3 — Lien Negotiation & Disbursement

**Phase:** Lien negotiation & disbursement · **Focus case:** John Doe VS Robert Smith · **Lead Counsel:** Atty. Elijah Thorne

**Objective.** With Track A settled at $40,000 gross (Day 2), negotiate and reduce the liens and the provider balances, hold the prior attorney's charging lien, finish the dual-stream Net Sheet, disburse a reconciled $20,359.92 net to John Doe and close the file: the final reconciliation, the closing memo and the retention schedule.

**Gate to the next day.** Liens resolved at $1,240.00 and $4,580.00 · the prior-attorney lien held and cleared · Net Sheet and Trust Ledger reconciled to $0.00 · disbursement started with the release signed · closing memo filed

**The file as this day opens.**

- Track A: the file settles. BI Time-Limited Demand served 07/20/2026; Keystone offers $3,500 on 08/05 and tenders the $10,000 limits on 08/12.
- Liens to resolve: Peach State $1,860.00 paid; Riverton Spine & Rehab $6,290.00 billed under its LOP.
- The Host UM and Relative UM stack closes at $30,000; a prior attorney's charging lien may be asserted against the fee.

> Generated from `js/cm-case-flow-data.js` by `build/case-flow/curriculum.cjs`. Edit the data and regenerate; never edit this file by hand. Spec: `00-architecture.md`. Theory map: `traceability.md`.

## Case continuity anchors

| | |
|---|---|
| **Case** | John Doe VS Robert Smith (LSH-2026-MVA-770412) — MVA — passenger injury |
| **Lead Counsel** | Atty. Elijah Thorne |
| **Date of loss** | 02/06/2026 · **SOL** 02/06/2028 (Docketed on a two-year limitation for this training file. Confirm the governing state's statute before relying on it.) |
| **Client** | John Doe — Front-seat passenger in the host vehicle |
| **Policy stack** | $10,000 BI / $20,000 HOST UM / $10,000 REL UM = **$40,000** |
| **Health plan** | Peach State Health Plan · PSH-55017742 · GRP-41208 |
| **Critical fact** | Initial 14-Day Treatment Gap, then disrupted care mid-treatment. |

## This day's module

The day is one module, on John Doe's one file, and runs the daily loop (`js/cm-day-loop.js`): first ALL of its lessons, in teaching order under their section headings; then the Case Profile (Day 1: Meet John Doe and his Intake; later days a check-in on what changed); then ONE Skill Building, AI graded (marked **Skill Building** below; on a build day, the Full Application Practice), with a short brainstorm after it; then 📁 Backup File Maintenance, required every day (marked **Required: Backup File Maintenance** below); then Update Your Action Plan (Day 1 step by step, lighter each day after); then the optional side exercises (marked *side*: an assumption and one entry to log in the CMS) in one short Practice Lab; the Knowledge Check closes the day. Each Skill Activity names the lesson it practises. A lesson marked (condensed) is a short overview.

**Module 3 — Lien Negotiation & Disbursement**

1. *Lesson* — Lien Negotiations: Key Legal Doctrines & Prior-Attorney Liens
2. *Lesson* — Increasing the Client's Net: Auditing the Billing
3. *Lesson* — The Net Sheet: Two Recovery Streams & the Master Ledger
4. *Lesson* — Disbursement: the Workflow & the Documentation
5. *Lesson* — Final Case Reconciliation: the Net Sheet, the Closing Memo & Retention
6. *Skill Activity* — Completing the Final Dual-Tab Net Sheet (practises: The Net Sheet: Two Recovery Streams & the Master Ledger) — **Skill Building**
7. *Skill Activity* — Health Subrogation & Statutory Lien Reduction Lab (practises: Lien Negotiations: Key Legal Doctrines & Prior-Attorney Liens) — *side*
8. *Skill Activity* — Prior-Attorney Charging Lien: Investigation, Escalation & Settlement Hold (practises: Lien Negotiations: Key Legal Doctrines & Prior-Attorney Liens) — *side*
9. *Skill Activity* — Provider Balance Negotiation Exercises (practises: Increasing the Client's Net: Auditing the Billing) — *side*
10. *Skill Activity* — The BI Settlement Net Sheet: Stream 1 at the Tender (practises: The Net Sheet: Two Recovery Streams & the Master Ledger) — *side*
11. *Skill Activity* — The UM Settlement Net Sheet: Stream 2 on the Day the Stack Closes (practises: The Net Sheet: Two Recovery Streams & the Master Ledger) — *side*
12. *Skill Activity* — Starting the Disbursement Command: Releases, Hold Cleared, Money Out (practises: Disbursement: the Workflow & the Documentation) — *side*
13. *Skill Activity* — Backup File Maintenance: the Pre-Demand Backup Audit (practises: Case Phase: Demand) — **Required: Backup File Maintenance**
14. *Knowledge Check* — Demand Execution Audit
15. *Knowledge Check* — Negotiation Mastery Check
16. *Knowledge Check* — Lien Reduction Verification

**End-of-day discussion (trainer):** It is 10/21/2026. John Doe's check reads $20,359.92, and he expected about $26,000: “Forty grand, lawyers take a third.” How do you walk him through his Net Sheet, and what is Atty. Thorne's call, not yours?

---

## Module 3 — Lien Negotiation & Disbursement

**Order:** Lessons (5) ➔ Case Profile ➔ Skill Building (Completing the Final Dual-Tab Net Sheet) ➔ Backup File Maintenance (required) ➔ Update Your Action Plan ➔ Practice Lab (6 optional side exercises) ➔ Knowledge Check (3 Learning Checks)

### 3.1.1 Lien Negotiations: Key Legal Doctrines & Prior-Attorney Liens

> **Lesson** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Not all liens are created equal: classify before you negotiate  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

**Best practices & pitfalls**

- Work the most negotiable lien first to build momentum, but resolve every one in writing before disbursement.
- Record a verified “none” the way you record a lien: with its source and its date.
- Name the doctrine and show the math in every Reduction Request.
- ⚠️ Pitfall: treating an ERISA plan like a provider LOP, or a fully insured plan like a self-funded one.
- ⚠️ Pitfall: asking for a “courtesy discount” with no legal basis.
- ⚠️ Pitfall: paying a prior attorney a percentage fee he is no longer entitled to.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 3) and that day's auto-graded questions.

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

### 3.1.2 Increasing the Client's Net: Auditing the Billing

> **Lesson** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Audit first, then show the lienholder the math  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

**Best practices & pitfalls**

- Corrections first, reductions second.
- Transparency about savings builds trust: show John Doe his net rising.
- Get every reduction in writing before disbursement.
- ⚠️ Pitfall: negotiating a percentage off an inflated bill.
- ⚠️ Pitfall: agreeing to a reduction verbally with no written confirmation.
- ⚠️ Pitfall: paying from a statement instead of the final payoff figure, or without the full-and-final language.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 3) and that day's auto-graded questions.

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

### 3.1.3 The Net Sheet: Two Recovery Streams & the Master Ledger

> **Lesson** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Final Accounting Check (`d3m4`)  
> **Topic:** One Net Sheet, two streams, every dollar's origin visible  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

### 3.1.4 Disbursement: the Workflow & the Documentation

> **Lesson** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Final Accounting Check (`d3m4`)  
> **Topic:** No money moves until every gate behind it is closed  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

### 3.1.5 Final Case Reconciliation: the Net Sheet, the Closing Memo & Retention

> **Lesson** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Final Accounting Check (`d3m4`)  
> **Topic:** After $0.00: the four document sets that let a file be archived, and the bill that comes after  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

- Show the finished closing letter, RS74 in Case Documents (settlement folder, beside the Case Cost Ledger): every figure ties to the signed Settlement Statement, and each lien's satisfaction is the lienholder's own Payoff Letter, attached as Enclosures A and B.
- Start at 10/22/2026 with the ledger at $0.00 and ask: “Can we archive today?” Make the room list what is still missing: confirmation numbers, both satisfactions, John Doe's receipt, the payer disclosure, a current W-9, the closing letter and the memo.
- The late-bill drill: a statement for Crescent's $1,540.00 arrives after the closing letter. Model answer: verify it against Peach State's EOB (a contractual write-off, no balance billing), route it to Atty. Thorne the same day, on his instruction ask Crescent in writing to correct its account, and tell John Doe today what is happening. Whether he owes anything is Atty. Thorne's to say.
- Retention trips people. The deck's schedule purges correspondence from the active server at 3 years, but this firm keeps the closed training file 7 years from closing, and the stricter rule controls. Ask which of John Doe's documents are financial records.
- Legal nuance: the payer disclosure is not a promise that nothing else paid. Other sources did, and recovering those bills is generally allowed (collateral source; confirm the governing rule). Its job is to make sure every reimbursement claim is known, so the release's indemnity promise can be kept.

---

### 3.1.6 Completing the Final Dual-Tab Net Sheet

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Final Accounting Check (`d3m4`)  
> **Topic:** Skill Activity 1 — take $40,000.00 to $20,359.92, and prove every line  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

### 3.1.7 Health Subrogation & Statutory Lien Reduction Lab

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Skill Activity 1 — reduce Peach State, clear the statutory side  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

**Best practices & pitfalls**

- Audit the Health Plan's claim too: a plan's ledger can carry charges unrelated to the collision.
- Record the absent liens with the same care as the present ones. Had Medicare paid, the file would stay pended until its final demand arrived (it can take 60 days or more) and was reconciled to the ledger.
- ⚠️ Pitfall: sending a request that argues a doctrine Atty. Thorne has not chosen.
- ⚠️ Pitfall: logging a verbal “we'll take a third off” as a final figure.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 3) and that day's auto-graded questions.

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

### 3.1.8 Prior-Attorney Charging Lien: Investigation, Escalation & Settlement Hold

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Final Accounting Check (`d3m4`)  
> **Topic:** Skill Activity 2 — the lien you didn't see coming, worked as evidence  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

### 3.1.9 Provider Balance Negotiation Exercises

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Skill Activity 2 — the reduction call to the chiropractor  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

**Best practices & pitfalls**

- Script the call before you dial: the audited balance, the recovery, the math, the ask.
- Lead with the audit correction; it tells the provider you have read the records.
- ⚠️ Pitfall: agreeing to the figure on the phone because it sounds good.
- ⚠️ Pitfall: a Payoff Letter without the full-and-final and no-balance-billing language.

#### 3 · Knowledge Check & CM Summary

Verified in Lien Reduction Verification (taught on Case Flow Day 3) and that day's auto-graded questions.

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

### 3.1.10 The BI Settlement Net Sheet: Stream 1 at the Tender

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Negotiation Mastery Check (`d3m2`)  
> **Topic:** Skill Activity — what Keystone's $10,000 does, and doesn't, do on its own  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#30` Skill Building: The Math Check — Your Slam-Dunk Liability Case · `D3#23` The Net Sheet: Purpose of a Combined BI/UM Net Sheet · `D3#24` The Net Sheet: Stream 1 (BI) and Stream 2 (UM/UIM) · `D3#26` The Net Sheet: Case Manager Protocols for Dual Settlements · Newly authored: the settlement-stage BI Net Sheet (Stream 1 at the tender, liens unreduced, projections labelled) and the BI-alone pro-rata fact pattern laid before Atty. Thorne

#### 1 · Visual Layout Description

The LSH Net Sheet across the left half, headed STREAM 1 · BI · KEYSTONE KM-26-440871 with a grey status chip TENDERED 08/12/2026 · NOT RECEIVED. Rows in mono: Gross $10,000.00, Fee 33⅓% $3,333.33, Costs (25%) $121.69, Peach State $465.00, Riverton Spine & Rehab $1,526.25, ending on a dashed orange box PROJECTION $4,553.73. Beside it a greyed Stream 2 column, HOST UM $20,000 · RELATIVE UM $10,000, stamped OPEN · NOT YET DEMANDED. The right third is a red-bordered card, BI STANDING ALONE: a $6,179.92 bar set against a longer $7,965.00 bar, the $1,785.08 gap hatched red, the shares $1,443.15 and $4,736.77 beneath, ending NET TO JOHN DOE $0.00. A navy footer strip: HELD IN TRUST UNTIL THE LIENS RESOLVE · ATTY. THORNE REVIEWS IT WITH JOHN DOE.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 08/12/2026 (Wed), Track A. This morning Dana Whitfield tendered Keystone's $10,000 BI limits (KM-26-440871) on the Time-Limited Demand's terms, inside the 08/21/2026 window; Robert Smith's affidavit of no other insurance came in on 08/10. No check has issued, no release is signed, and the consent-to-settle requests to Harbor Point and Cardinal State have not gone out. The UM layers (Host UM $20,000, Relative UM $10,000) are not yet demanded. Liens as they stand today: Peach State $1,860.00 asserted; Riverton Spine & Rehab $6,105.00 audited (billed $6,290.00); no reduction requested. Costs receipted: $486.75. Atty. Thorne's memo asks for the BI settlement Net Sheet before he reviews the tender with John Doe: Stream 1 on his 25% / 75% working allocation (BI's share of the $40,000 Recovery Stack), and BI standing alone.

**Execution prompt.** Build the settlement-stage Net Sheet for Stream 1 in the LSH Net Sheet. Enter the $10,000.00 gross as tendered, not received, with the 33⅓% pre-suit fee from the Contingency Fee Agreement and the five receipted costs. Enter both liens as they stand on 08/12/2026, asserted or audited, with the reduction column left blank. Leave Stream 2 open, with no recovery entered. Run Atty. Thorne's 25% allocation of costs and liens down to a Stream 1 net, labelled as a projection with what it assumes. Beside it, run the BI-alone fact pattern: what the fee and costs leave, set against the unreduced liens, shared pro rata. Route the sheet to Atty. Thorne through CMS → Tasks → Escalate. Graded judgment: what you lay in front of him as fact (the BI money cannot be paid out on its own and is held in trust until the liens resolve), and what you leave to him: the allocation, any lien strategy and everything said to John Doe about value.

| | |
|---|---|
| **Tool / interface** | LSH Net Sheet · CMS → Financial Ledger → Trust · CMS → Tasks → Escalate |
| **Expected output** | A Stream 1 settlement Net Sheet at the 08/12/2026 tender: a labelled 25% projection ($4,553.73) beside the BI-alone fact pattern ($0.00 to John Doe), routed to Atty. Thorne with the trust-hold flag. |

**Verification checkpoints**

- [ ] Status on the sheet: Keystone tender 08/12/2026 (Wed), inside the 08/21/2026 window; marked tendered, not received; no release signed; nothing posted to the Trust Ledger
- [ ] Stream 1 gross $10,000.00 (Keystone, KM-26-440871); Stream 2 left open with no recovery entered (Host UM $20,000 and Relative UM $10,000 not yet demanded); PIP's $5,000.00 and Keystone's property-damage payments kept off
- [ ] Fee at the pre-suit 33⅓% (Contingency Fee Agreement): one-third of $10,000.00 = $3,333.33 (typing 33.33% gives $3,333.00)
- [ ] Costs receipted: $25.00 + $214.75 + $72.00 + $25.00 + $150.00 = $486.75; on the 25% allocation $121.69 to Stream 1, the $365.06 remainder held for Stream 2, charged once
- [ ] Liens as they stand on 08/12/2026: Peach State $1,860.00 asserted (its payment for Crescent's 05/15/2026 injection); Riverton Spine & Rehab $6,105.00 audited ($6,290.00 billed less the $185.00 duplicate of 05/04/2026); total $7,965.00; reduction column blank, “not yet requested”
- [ ] Projection, labelled with its assumption (Atty. Thorne's 25% / 75% working allocation; the UM layers still to be recovered; liens unreduced): Peach State $465.00 + Riverton Spine & Rehab $1,526.25 = $1,991.25 to Stream 1
- [ ] Projected Stream 1 net: $10,000.00 – $3,333.33 – $121.69 – $1,991.25 = $4,553.73, marked PROJECTION, never shown as money John Doe will receive
- [ ] BI-alone fact pattern: $10,000.00 – $3,333.33 – $486.75 = $6,179.92 against $7,965.00 of unreduced liens, a shortfall of $1,785.08
- [ ] Shared pro rata: Peach State 23.35% → $1,443.15; Riverton Spine & Rehab 76.65% → $4,736.77; total $6,179.92; net to John Doe $0.00
- [ ] Trust-hold flag routed as a fact: once received, the BI money goes into the IOLTA trust account and cannot be paid out on its own; it is held until the liens resolve (confirm the governing trust rule)
- [ ] Routed to Atty. Thorne on 08/12/2026, before John Doe signs anything; the allocation method, any lien reduction and every word to John Doe about value left to him, with no figure given to John Doe by the CM

**Best practices & pitfalls**

- Label every figure that depends on money not yet in hand as a projection, and say what it assumes.
- Enter each lien as it stands today, asserted or audited; a reduction goes in only when it is agreed in writing.
- Put the BI-alone math beside the projection, so Atty. Thorne sees the floor and the hope on one page.
- ⚠️ Pitfall: posting a tender as money in trust; nothing is deposited until the check arrives after the release is signed.
- ⚠️ Pitfall: charging the full $486.75 of costs to Stream 1 and again to Stream 2.
- ⚠️ Pitfall: telling John Doe what he will “get from the BI” before Atty. Thorne has reviewed the sheet with him.

#### 3 · Knowledge Check & CM Summary

Verified in Negotiation Mastery Check (taught on Case Flow Day 3) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Stream 1 arithmetic | $3,333.33 fee, $121.69 costs, $465.00 + $1,526.25 liens, projected net $4,553.73 |
| 🤖 AI | **15%** | BI-alone fact pattern | $6,179.92 against $7,965.00, shortfall $1,785.08, shares $1,443.15 / $4,736.77, net $0.00 |
| 🤖 AI | **15%** | Liens as they stand | Peach State $1,860.00 asserted, Riverton Spine & Rehab $6,105.00 audited, no reduction entered |
| 🤖 AI | **10%** | Status and labels | Tendered, not received; Stream 2 open; every projection labelled with its assumption |
| 🧑‍🏫 Trainer | **15%** | Trust-hold flag | Explains, from the numbers, why the BI money cannot be paid out alone and is held until the liens resolve |
| 🧑‍🏫 Trainer | **25%** | UPL boundary | Allocation, lien strategy and value left to Atty. Thorne; no figure or opinion given to John Doe |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the question John Doe will ask: “Keystone paid $10,000. Why can't I have my share now?” Let the room find the answer in the BI-alone math: $6,179.92 left against $7,965.00 of liens, so John nets nothing until the liens resolve.
- Grade the dates. On 08/12/2026 no check has issued and no release is signed; the Limited Release comes 08/28 and Keystone's check reaches trust 09/04. A trainee who posts $10,000.00 to the Trust Ledger today has posted a promise.
- Fail any reduced lien on this sheet. $1,240.00 and $4,580.00 do not exist until 10/09 and 10/12. Later, the final sheet (d3m4-a1) lands Stream 1 at $5,089.98: the $4,553.73 projection plus 25% of the $2,145.00 negotiated off, $536.25.
- The 25% / 75% split is Atty. Thorne's working allocation, not the Case Manager's forecast of the UM claims. The CM computes and labels; he decides the method and what John Doe hears about value.

---

### 3.1.11 The UM Settlement Net Sheet: Stream 2 on the Day the Stack Closes

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Negotiation Mastery Check (`d3m2`)  
> **Topic:** Skill Activity — project the UM stream to the cent, mark what will move, ask Atty. Thorne  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D3#23` The Net Sheet: Purpose of a Combined BI/UM Net Sheet · `D3#24` The Net Sheet: Stream 1 (BI) and Stream 2 (UM/UIM) · `D3#25` The Net Sheet: The LSH Corporate Net Sheet Ledger · `D3#26` The Net Sheet: Case Manager Protocols for Dual Settlements · `D2#36` The Execution: The Settlement Statement (The “Net” Sheet) · Newly authored: the settlement-stage Stream 2 Net Sheet on 10/06/2026, liens unreduced, every moving figure marked as a projection, and the written questions for Atty. Thorne

#### 1 · Visual Layout Description

The LSH Net Sheet's Recovery Ledger on a white card, with the Stream 2 — UM column lit in navy and the Stream 1 — BI column greyed beside it. Rows top to bottom: HARBOR POINT $20,000.00 with a green IN TRUST 10/05 chip; CARDINAL STATE $10,000.00 with an amber TENDERED · CHECK NOT RECEIVED chip; FEE 33⅓% $10,000.00; COSTS 75% $365.06; PEACH STATE 75% $1,395.00 and RIVERTON SPINE & REHAB 75% $4,578.75, each with an orange dashed border and a PROJECTION tag. At the foot, a large orange NET (PROJECTED) $13,661.19. A thin tie line runs from the Stream 2 net across to the grey Stream 1 net and into a mono pill: $18,214.92 = $40,000.00 – $13,333.33 – $486.75 – $7,965.00. Pinned at the right edge, a navy memo card with four numbered blanks: QUESTIONS FOR ATTY. THORNE.

#### 2 · Slide Body — the scenario and the task

**Scenario.** File date 10/06/2026 (Tue), Track A. Today Teresa Okafor tendered Cardinal State's $10,000 Relative UM limits (CS-26-20355), and John Doe accepted through Atty. Thorne. Harbor Point paid its $20,000 Host UM limits (HP-26-7741) on 09/29; the check was received and deposited 10/05 after the release was signed. Keystone's $10,000 BI has been in trust since 09/04. Trust holds $30,000.00; Cardinal State's check has not arrived. Peach State asserts $1,860.00, and its Reduction Request is drafted and held for Atty. Thorne's approval. Riverton Spine & Rehab's LOP account stands at $6,290.00 billed, $6,105.00 after the audit removed the 05/04/2026 duplicate. No lien reduction is agreed. Costs to date: $486.75. At 4:20 p.m. Atty. Thorne asks for the UM settlement Net Sheet for his review before he goes through it with John Doe.

**Execution prompt.** Build the Stream 2 (UM) column of John Doe's LSH Net Sheet as it stands today. Post both UM layers to the Recovery Ledger and show which check is in trust and which is only tendered. Apply the pre-suit 33⅓% fee, then allocate costs and liens to Stream 2 at 75%, pro rata to gross, with each lien at its asserted or audited figure, not a hoped-for reduction. Mark every figure that will still change as a projection and say what will change it. Tie Stream 2 to Stream 1 and to the Trust Ledger. Graded judgment: write the questions Atty. Thorne must answer before John Doe sees this sheet, and route it to him, not to John.

| | |
|---|---|
| **Tool / interface** | CMS → Financial Ledger → Net Sheet → Recovery Ledger · CMS → Financial Ledger → Trust · CMS → Tasks → Escalate |
| **Expected output** | A Stream 2 Net Sheet projecting $13,661.19 to John Doe, every moving figure marked, tied to Stream 1 and the Trust Ledger, routed to Atty. Thorne with four written questions. |

**Verification checkpoints**

- [ ] Stream 2 gross from the two UM layers only: Harbor Point $20,000.00 (paid 09/29, received 10/05/2026) + Cardinal State $10,000.00 (tendered 10/06/2026) = $30,000.00, 75% of the $40,000.00 stack; Keystone's $10,000.00 stays in Stream 1
- [ ] Fee at the pre-suit 33⅓% (no suit filed; retainer RS05): $30,000.00 ÷ 3 = $10,000.00, the one firm line on the sheet; with Stream 1's $3,333.33 the file's fee is $13,333.33
- [ ] Costs to date $486.75 allocated pro rata: Stream 1 25% = $121.69 (rounded), Stream 2 the remainder, $486.75 – $121.69 = $365.06; marked projection (costs to date, final at the Settlement Statement)
- [ ] Peach State at its asserted $1,860.00: Stream 1 $465.00, Stream 2 $1,860.00 – $465.00 = $1,395.00; marked projection: Reduction Request held for Atty. Thorne's approval, nothing agreed
- [ ] Riverton Spine & Rehab at the audited $6,105.00, not the billed $6,290.00 (the $185.00 duplicate of 05/04/2026): Stream 1 $1,526.25, Stream 2 $6,105.00 – $1,526.25 = $4,578.75; marked projection: no reduction requested or agreed
- [ ] Projected Stream 2 net: $30,000.00 – $10,000.00 – $365.06 – $1,395.00 – $4,578.75 = $13,661.19, labelled “projection, liens unreduced”
- [ ] Harbor Point's $5,000.00 PIP shown at $0.00 on Stream 2 with its source: add-on (excess) UM, no PIP non-duplication reduction and no reimbursement right (Harbor Point's 03/02/2026 letter), so the $20,000.00 is not reduced
- [ ] Tied to Stream 1: Stream 1 projects $10,000.00 – $3,333.33 – $121.69 – $465.00 – $1,526.25 = $4,553.73, and $13,661.19 + $4,553.73 = $18,214.92 = $40,000.00 – $13,333.33 – $486.75 – $7,965.00
- [ ] Tied to the Trust Ledger: $30,000.00 on deposit (Keystone $10,000.00 since 09/04, Harbor Point $20,000.00 since 10/05/2026); Cardinal State's $10,000.00 shown as receivable, not received; nothing disbursed from either stream
- [ ] What moves the projection stated on the sheet: every $1.00 cut from a lien adds $0.75 to Stream 2 and $0.25 to Stream 1; no reduced figure is entered before a written acceptance
- [ ] Four questions to Atty. Thorne in writing: (1) the 33⅓% tier on both UM layers; (2) the 25% / 75% pro-rata allocation of costs and liens; (3) authority and timing for both Reduction Requests, including raising the $185.00 duplicate with Tammy Greer; (4) when and in what form John Doe sees a projected sheet
- [ ] Routed to Atty. Thorne the same day through CMS → Tasks → Escalate; the sheet is not sent to John Doe and no net figure is quoted to him by the CM

**Best practices & pitfalls**

- Label every figure that can still move, and write on its line what will move it.
- Compute Stream 1's share of each split and take Stream 2's as the remainder, so the streams add back to the cent.
- Keep money in trust and money only tendered on separate lines until the check clears.
- ⚠️ Pitfall: charging all of the costs and liens to the UM stream because it is the bigger check.
- ⚠️ Pitfall: entering a lien at the reduction you hope for before a written acceptance.
- ⚠️ Pitfall: quoting John Doe a net from a projected sheet.

#### 3 · Knowledge Check & CM Summary

Verified in Negotiation Mastery Check (taught on Case Flow Day 3) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Stream 2 arithmetic | $30,000.00 gross, $10,000.00 fee, $365.06 costs, $1,395.00 and $4,578.75 liens, $13,661.19 projected net, each shown |
| 🤖 AI | **15%** | Lien basis on 10/06/2026 | Peach State at $1,860.00 asserted, Riverton Spine & Rehab at $6,105.00 audited; no reduced figure entered; PIP at $0.00 with its source |
| 🤖 AI | **10%** | Projection marking | Every moving line tagged with what will change it; the fee the only firm deduction; Cardinal State shown as receivable |
| 🤖 AI | **15%** | Tie-out | $13,661.19 + $4,553.73 = $18,214.92 across the file; $30,000.00 in trust agrees with the ledger |
| 🧑‍🏫 Trainer | **20%** | Questions for Atty. Thorne | Fee tier, allocation, reduction authority and the client presentation asked as questions he can answer from the sheet |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | No net quoted to John Doe, no reduction proposed to a lienholder, no view on whether the sheet is enough |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Put the tempting wrong answers on the board: $11,548.25 (all $486.75 of costs and $7,965.00 of liens charged to the UM stream), $13,522.44 (Riverton Spine & Rehab at its billed $6,290.00) and $15,269.94 (reductions assumed before anyone agreed to them). Only $13,661.19 is true on 10/06/2026.
- Ask the room: “Harbor Point paid John Doe's PIP and his Host UM. Why isn't the $5,000.00 taken off the $20,000.00?” The answer is Harbor Point's own 03/02/2026 letter: add-on UM, no non-duplication reduction, no reimbursement right.
- For your debrief only: on 10/13/2026 (d3m4-a1) Stream 2 reaches $15,269.94. The move, $15,269.94 – $13,661.19 = $1,608.75, is 75% of the $2,145.00 negotiated off the liens ($620.00 + $1,525.00): exactly the $0.75-per-dollar rule on the sheet.
- Stream 1's lines are the BI sheet's work; here they are used only to tie. Grade the client line hard: the CM routes the sheet to Atty. Thorne, and he decides when John Doe sees a projection and explains it.

---

### 3.1.12 Starting the Disbursement Command: Releases, Hold Cleared, Money Out

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Final Accounting Check (`d3m4`)  
> **Topic:** Skill Activity 3 — confirm every gate, then move the money to $0.00  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

### 3.1.13 Backup File Maintenance: the Pre-Demand Backup Audit

> **Skill Activity** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Demand Execution Audit (`d3m1`)  
> **Topic:** Skill Activity — audit the backup against the CMS before the demand goes out  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#12` Bottleneck: Conflict Check Delays · `D1#13` Bottleneck: Intake Form Errors · LSH firm standard: backup drive folder hierarchy

#### 1 · Visual Layout Description

A two-column audit sheet: CMS on the left, BACKUP DRIVE on the right, rows linked by green ticks, one row with a red gap. Below it a counter reads 18 OF 18 BACKED UP. In the 03, 04 and 07 folder chips, a current document sits on top of a greyed copy stamped SUPERSEDED. On the right, the Demand Package chip drops into 05 Insurance, Demands & Negotiation with an orange DRAFT FOR AUDIT tag.

#### 2 · Slide Body — the scenario and the task

**Scenario.** 07/17/2026, 3:00 p.m. The pre-demand audit closed on 07/15/2026 and the BI Time-Limited Demand is served on 07/20/2026. Since the last backup, corrected documents have replaced earlier ones: Summit Imaging's corrected-history addendum to the MRI report (07/15/2026), Crescent Pain & Spine's corrected $0.00 patient statement (07/10/2026, replacing the 07/01/2026 statement) and the final Lost Wage Verification Record (07/01/2026, replacing the 06/23/2026 draft worksheet). The demand specialist's draft demand and exhibit packet are on the file for audit.

**Execution prompt.** Audit your Backup Drive against the CMS before the demand goes out. Open 📂 My Backup Drive and compare its count of backed-up documents with the documents filed in the CMS; for any filed document not on the drive, back it up from 📁 Work From. For each corrected document, put the current version in its folder and keep the version it replaces beside it, renamed with SUPERSEDED and the date of the version that replaced it as the last part of its name: the MRI addendum in 03 Medical Records, Crescent's corrected statement in 04 Bills & Invoices, the final wage record in 07 Wages & Costs. File the draft demand and the exhibit packet so they land in 05 Insurance, Demands & Negotiation, labeled DRAFT as the last part of their names. Run ✓ Check my drive, and record the audit in Case Notes: X of Y backed up, what you replaced and what you labeled.

| | |
|---|---|
| **Tool / interface** | Backup Drive · CMS → Documents · CMS → Case Notes |
| **Expected output** | A backup that matches the CMS document for document, superseded versions kept and labeled, the demand drafts in 05 Insurance, Demands & Negotiation, a clean drive check and the audit recorded in Case Notes. |

**Verification checkpoints**

- [ ] Every document filed in the CMS is on the drive: X of Y backed up, with X equal to Y
- [ ] The MRI addendum, Crescent's corrected $0.00 statement and the final wage record each in its folder as the current version
- [ ] The 07/01/2026 Crescent statement and the 06/23/2026 wage worksheet kept, renamed SUPERSEDED with the replacing version's date; nothing deleted
- [ ] The draft demand and the exhibit packet in 05 Insurance, Demands & Negotiation, labeled DRAFT
- [ ] ✓ Check my drive run with no folder missing
- [ ] The audit in Case Notes: the count, what was replaced and what was labeled

**Best practices & pitfalls**

- Audit the backup before every outgoing package: what the adjuster receives must be on the firm's own drive first.
- Supersede, never delete: the old version explains why the new one exists.
- ⚠️ Pitfall: two files with the same name in one folder and no way to tell which is current.
- ⚠️ Pitfall: leaving the draft demand in 01 Intake & Retainer because it was opened from the Case Files tab.

#### 3 · Knowledge Check & CM Summary

Verified in Demand Execution Audit (taught on Case Flow Day 3) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Backup matches the CMS | Every filed document backed up: X of Y with X equal to Y |
| 🤖 AI | **16%** | Superseded versions | Current versions in their folders; superseded versions kept and labeled with the replacing date |
| 🤖 AI | **12%** | Demand Package placed | Draft demand and exhibit packet in 05 Insurance, Demands & Negotiation, labeled DRAFT; drive check clean |
| 🤖 AI | **12%** | File names | Every file on the drive named by the firm's naming convention, with DRAFT or SUPERSEDED and its date as the last part of the name |
| 🧑‍🏫 Trainer | **25%** | Audit discipline | Works the CMS list one document at a time rather than eyeballing folders |
| 🧑‍🏫 Trainer | **15%** | Explaining the audit | Case Note states the count and the changes plainly for Atty. Thorne |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Before anyone opens the drive, ask: “If Keystone says it never got the corrected statement, where do we prove which version was current on 07/20?” The labeled backup is the answer.
- Check the labels: SUPERSEDED with the replacing version's date. A label without a date doesn't tell a colleague which is current.
- Have two trainees read out their X of Y. A gap is a document the firm can't put its hand on if the CMS is down.

---

### 3.1.14 Demand Execution Audit

> **Knowledge Check** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Demand Execution Audit (`d3m1`)  
> **Topic:** Demand Execution Audit + CM Learning Summary & Self-Scale  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#13` Treatment Gaps in the Demand Phase · `D2#15` Demand: Quality Control — The “Final Scrub” · `D2#18` Skill Building: Demand Phase Challenge — Real-Time Demand Audit · `D2#31` BI Settlement — Phase II: The UM/UIM “Safety Check” · `D3#3` BI Exhaustion & Consent — Mechanic 1: Locking the Escape Hatches · `D3#6` UM Demand: The Demand Packet — Document Inclusions · `D3#9` UM Settlement: The “Offset” Rule & the Timeline · `D3#12` Documents that Matter: Threshold & Coverage Documents · `D3#15` Documents that Matter: General Damages Documents (Non-Economic Value)

#### 1 · Visual Layout Description

Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange; questions 4 and 6 each carry a small red PRESSURE chip. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SKILL SCALE as a five-step horizontal ladder with the six competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar, to show it is not part of the weighting.

#### 2 · Slide Body — Knowledge verification

1. State the terms of the BI demand to Keystone, how it was served, and the date its window closed. Show how you counted the deadline.
2. Name the five elements that make a Time-Limited Demand one a carrier must answer, with this file's example of each. Who decides whether a refusal is bad faith?
3. Keystone calls John Doe's MRI degenerative and points to the 14-day gap. Which documents answer each point, and where in the package do they go?

**Best practices & pitfalls**

- Answer with the file's own dates, figures and names, not general rules.
- ⚠️ Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize, in your own words, what you learned serving John Doe's demands: the principles that make a demand hold, not the clicks.
- Articulate your strategy: with both UM drafts on Atty. Thorne's desk on 08/31/2026, what is your next action on this file, and why is it the right one rather than something else?
- Identify the one thing in this module you are least confident about (the deadline count, consent and substitution, add-on vs offset, the release), and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Computing and docketing a Time-Limited Demand's deadline from the written acknowledgement of receipt | ○ | ○ | ○ | ○ | ○ |
| Auditing a Demand Package against the Big Four and the Final Scrub | ○ | ○ | ○ | ○ | ○ |
| Presenting a Treatment Gap and a causation dispute up front | ○ | ○ | ○ | ○ | ○ |
| Securing UM consents and a Limited Release before BI closes | ○ | ○ | ○ | ○ | ○ |
| Structuring secondary UM demands with exhaustion proof on page one | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary on terms, extensions and releases | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (12 questions):

1. Dana Whitfield acknowledged the emailed BI demand in writing on 07/22/2026. Its 30-day acceptance window closes on:  
   08/19/2026 · **✓ 08/21/2026** · 08/22/2026 · 08/20/2026  
   *The window runs 30 days from her written acknowledgement of receipt: 07/22/2026 + 30 = 08/21/2026, a Friday. 08/19/2026 counts from the 07/20 send date (the wrong trigger), 08/22/2026 adds a calendar month, and 08/20/2026 counts the day of receipt as day one.*
2. Which of these would let Keystone refuse the Time-Limited Demand safely?  
   A window of 30 days from receipt · A release limited to Robert Smith and Keystone · **✓ A demand for $16,401.40, the full Specials** · Service by email to Dana Whitfield, with her written acknowledgement of receipt  
   *Keystone's BI limit is $10,000. A demand above the limit is one Keystone cannot accept within its policy, so refusing it generally sets nothing up (confirm the governing rule). The other three are what make the demand hold.*
3. Why can John Doe's file still reach the full $20,000 Host UM limit after Keystone pays $10,000?  
   **✓ Harbor Point confirmed in writing (03/02/2026) that its UM is add-on, so the BI payment does not reduce it** · UM limits are never reduced by a BI payment · PIP's $5,000 covers the BI offset · Cardinal State pays whatever Harbor Point deducts  
   *Add-on UM is not reduced by the BI payment. Under an offset form the $10,000 BI would come off the $20,000 limit, leaving $10,000. Offset rules vary by state and policy, which is why the carrier's written confirmation is the source.*
4. When must Harbor Point's and Cardinal State's consents to settle be in writing?  
   Only if a UM carrier asks for one · Before Keystone's check clears the trust account · Within 30 days after the BI release is signed · **✓ Before John Doe signs Keystone's release**  
   *Releasing Robert Smith without the UM carriers' written consent can impair their subrogation rights and cost John Doe the UM coverage. On this file: consents 08/24 and 08/26/2026, Limited Release signed 08/28/2026.*
5. The Relative UM demand to Cardinal State (Teresa Okafor, CS-26-20355) goes out 08/31/2026 framed as excess. What must its package show?  
   **✓ Damages above the $30,000 already reached through the $10,000 BI and the $20,000 Host UM** · Damages above the $10,000 BI only, the same showing as Harbor Point's package · Only that John Doe is a resident relative under Margaret Doe's policy (03/09/2026) · A cross-reference to Harbor Point's package, since the two claims share one file  
   *Relative UM is excess: Cardinal State answers only above the $30,000 from BI and Host UM, up to $10,000. Each carrier gets its own complete package with the exhaustion proof on page one; the damages figure itself is Atty. Thorne's valuation.*
6. How is the BI Time-Limited Demand served?  
   By email, with the deadline docketed from the 07/20/2026 send date · **✓ By email to Dana Whitfield from the Email Workspace, logged, with her written acknowledgement of receipt requested** · Regular mail · By phone to Dana Whitfield  
   *The letter says the 30 days run from her written acknowledgement of receipt. Email it with the Demand Package attached, log it, and docket from her acknowledgement (07/22/2026), never from the send date.*
7. Under the BI demand's terms, who is released?  
   Everyone, both UM carriers included · **✓ Robert Smith and Keystone only, for the BI claim only** · Keystone only · Robert Smith, Keystone and Harbor Point  
   *A Limited Release: Smith and Keystone, the BI claim only. The Civic's PD claim stays open.*
8. What does the demand lead causation with?  
   **✓ The 03/13/2026 MRI: a C5-C6 herniation with no significant degenerative change at the adjacent levels** · The police citation · John Doe's own statement · The Property Damage photos  
   *That MRI line answers “degenerative”. The gap is answered first, with records made at the time.*
9. When may the UM demands go out?  
   With the BI demand · **✓ Once Keystone's $10,000 tender is documented and the Limited Release is signed** · Any time after the LORs · Before the BI demand, to pressure Keystone  
   *BI exhaustion first: notice of both UM claims went out in 03/2026, but the demands wait. They went out 08/31/2026.*
10. Keystone's 08/14 draft release frees “all other persons, firms, corporations and insurers.” What do you do?  
   Send it to John Doe to sign · **✓ Flag it to Atty. Thorne: it would release both UM carriers** · Sign it for the firm · Ignore the wording  
   *Limit the release to Robert Smith and Keystone, and to the BI claim. The Limited Release was signed 08/28/2026.*
11. Building John Doe's Host UM package for Harbor Point, which documents prove the threshold?  
   A DMV suspension letter for Robert Smith · **✓ Harbor Point's coverage proof plus Keystone's exhaustion proof: its tender, Dec Page, Smith's affidavit and the signed Limited Release** · A Police Report noting a phantom vehicle · John Doe's own auto Dec Page  
   *Smith was insured, so the UM claim rests on exhausting Keystone's $10,000, proven by the tender, Keystone's Dec Page, Smith's affidavit and the Limited Release, plus Harbor Point's own coverage proof. Proof of uninsured status (a DMV suspension, a phantom vehicle) belongs to a truly uninsured claim. John Doe owns no car and has no auto policy.*
12. Which line belongs in the Human Story the Case Manager drafts for Atty. Thorne's review?  
   “John's life was devastated, and he may never work again.” · “His claim is worth at least the $10,000 limit.” · **✓ “He missed five shifts at Northgate (02/09–02/13) citing neck pain, and at MMI still has intermittent right-arm paresthesia.”** · “Future injections of $3,400–$6,800 are added to his Specials.”  
   *The Human Story says only what John Doe's words and the records support, in facts and dates. An embellished line costs the story its credibility, value is Atty. Thorne's, and future care belongs in the narrative, never in the Specials total.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Terms and deadline | $10,000; Limited Release of Smith and Keystone only; Smith's affidavit; 07/22/2026 + 30 = 08/21/2026 |
| 🤖 AI | **15%** | Stack and exhaustion | $40,000 via Harbor Point's add-on form and Cardinal State's stacking terms, each confirmed in writing; offset would leave $10,000 on Host UM; consents before the release; exhibits named |
| 🤖 AI | **15%** | Gap rebuttal | MRI adjacent-level line, Causation Letter and EMS report named and placed up front |
| 🤖 AI | **15%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Terms, extensions, release review and any bad-faith analysis routed to Atty. Thorne |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 4 is the keystone and a pressure test. The right answer explains the process, not the law: nothing is signed until both consents are in and Atty. Thorne has gone through the release with him; log the call and route it the same day. A trainee who can't say what the consent protects has memorised the dates without the reason.
- Put Question 6 to the room before anyone writes. The right answer logs the auto-reply, which is not a written acknowledgement of receipt; follows up the same day and asks Keystone in writing for the covering adjuster; tells Atty. Thorne; and dockets nothing from the send date. Any change to timing or terms is his, not the CM's.
- Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.
- UPL is a gate: a strong score does not survive an ethics breach.

---

### 3.1.15 Negotiation Mastery Check

> **Knowledge Check** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Negotiation Mastery Check (`d3m2`)  
> **Topic:** Knowledge Check + CM Learning Summary & Self-Scale  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#19` Settlement Negotiations: The Pitch & the Negotiation Battle Map · `D2#20` The Valuation Baseline: PIP Set-Off (The Credit) · `D2#23` The Valuation Baseline: Subrogation vs. Non-Subrogation · `D2#27` Common Adjuster “Stall Tactics” and Rebuttals · `D2#28` Close the Deal: The “Final-Final” and the Paper Trail · `D2#29` Settlement Negotiations: The “Never” Rule · `D2#30` Skill Building: The Math Check — Your Slam-Dunk Liability Case · `D3#9` UM Settlement: The “Offset” Rule & the Timeline · `D3#11` UM Settlement: The Final Payout Process · `D3#17` Skill Building: UM Settlement — The Bad-Faith Arbitrage & the Permanent Deficit

#### 1 · Visual Layout Description

Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, seven questions numbered in orange, the pressure question (⑥) set apart on a red-bordered card. Lower half, below a full-width orange hairline: the CM LEARNING SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SELF-SCALE as a five-step horizontal ladder with six competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar.

#### 2 · Slide Body — Knowledge verification

1. Keystone offered $3,500 on 08/05/2026. Run the math check: fee, costs, unreduced liens and John Doe's net. What does the result tell Atty. Thorne, and who tells John Doe?
2. Dana Whitfield says the 14-Day Gap proves the crash didn't hurt John Doe and the MRI is degenerative. Answer both from the file, naming four documents and quoting the radiologist.
3. Explain what the $5,000 add-on PIP, exhausted and non-subrogated, means for the valuation baseline, and what would change in a no-fault state.

**Best practices & pitfalls**

- Answer with the file's own numbers, dates and documents, not general rules.
- ⚠️ Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize, in your own words, what you learned negotiating John Doe's file: the principles, not the clicks.
- Articulate your strategy: if a carrier's offer landed on this file today, what is your next action, and why is it the right next action rather than a counter?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Building the battle map and the net floor before a negotiation | ○ | ○ | ○ | ○ | ○ |
| Rebutting a gap-based causation defense with the medical record | ○ | ○ | ○ | ○ | ○ |
| Answering adjuster stall tactics with facts and deadlines | ○ | ○ | ○ | ○ | ○ |
| Applying the valuation baseline: set-off, subrogation and UM offset | ○ | ○ | ○ | ○ | ○ |
| Logging, confirming and papering every offer and acceptance | ○ | ○ | ○ | ○ | ○ |
| Holding the authority line: every number and decision through Atty. Thorne | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (13 questions):

1. Keystone offers $3,500 on 08/05/2026. On unreduced liens of $7,965.00, what does John Doe net after the one-third fee and $486.75 in costs?  
   $2,333.33 · $3,013.25 · **✓ $0.00: the $1,846.58 left cannot cover the liens** · $1,846.58  
   *$3,500 – $1,166.67 fee – $486.75 costs = $1,846.58, against $7,965.00 of liens. The offer nets John Doe nothing. That is the math check Atty. Thorne needs before he conveys the offer.*
2. Dana Whitfield calls John Doe's MRI degenerative. Which answer comes straight from the file?  
   **✓ Dr. Helen Park's read: “no significant degenerative change at the adjacent levels.”** · “John Doe has never had chiropractic care of any kind.” · “Some degeneration is normal at 34, so it doesn't matter.” · “If you drop that argument, we can come down from limits.”  
   *The radiologist's own sentence answers it. John Doe did have chiropractic care (three 2021 low-back visits, resolved), and only Atty. Thorne can move off the Limits Demand.*
3. Harbor Point offers $8,000 on the Host UM claim, arguing “BI already compensated him.” Which document answers that?  
   Keystone's Declaration Page of 03/20/2026 · Cardinal State's Coverage Letter of 03/09/2026 · Peach State's reimbursement notice · **✓ Harbor Point's own letter of 03/02/2026: its UM is add-on (excess), not reduced by the BI payment**  
   *On a reduction policy Keystone's $10,000 would come off the $20,000 limit. Harbor Point confirmed in writing that its UM is add-on, so the BI payment does not shrink the $20,000 limit; whether damages fill that room is shown with the medical proof.*
4. Cardinal State tenders its $10,000 Relative UM limits on 10/06/2026. Who accepts it?  
   The Case Manager, because it is the full limit · **✓ John Doe, on his informed decision, conveyed through Atty. Thorne** · Atty. Thorne alone, without troubling the client · Harbor Point, as the primary UM carrier  
   *Settlement is the client's decision. Atty. Thorne advises him and conveys it; the Case Manager logs the decision and drafts the acceptance email for Atty. Thorne to approve.*
5. Before the first call with Dana Whitfield, the battle map sets John Doe's net floor. With $7,965.00 in unreduced liens, $486.75 in costs and the one-third fee, what gross does he need just to reach $0.00 net?  
   $8,451.75 · **✓ $12,677.63** · $10,000.00 · $16,401.40  
   *Liens + costs = $7,965.00 + $486.75 = $8,451.75; × 1.5 for the one-third fee = $12,677.63 gross. That is above Keystone's $10,000 limit, which is why every UM layer and lien reduction matters. $8,451.75 forgets the fee; $16,401.40 is the Specials.*
6. Keystone tenders its $10,000 BI limits on 08/12/2026. Standing alone, after the one-third fee and $486.75 in costs, what does that money do against $7,965.00 of unreduced liens?  
   Leaves John Doe $6,666.67 to be paid out now · **✓ Leaves $6,179.92 against $7,965.00: shared pro rata, $1,443.15 and $4,736.77, John Doe nets $0.00** · Pays both liens in full and leaves John Doe $2,035.00 · Leaves $4,553.73 for John Doe as soon as the check arrives  
   *$10,000.00 – $3,333.33 – $486.75 = $6,179.92, a $1,785.08 shortfall against $7,965.00. Shared pro rata, Peach State takes $1,443.15 and Riverton Spine & Rehab $4,736.77. $4,553.73 is only a projection on Atty. Thorne's 25% allocation, and it assumes the UM layers are still to come.*
7. Keystone's $10,000 is tendered on 08/12/2026. What does the Case Manager do with the BI settlement Net Sheet?  
   Call John Doe and tell him his projected BI net · Enter the hoped-for lien reductions so the net looks right · **✓ Lay it before Atty. Thorne, projections labelled, flagging that the BI money cannot be paid out alone and is held in trust until the liens resolve** · Disburse the fee now and hold only the liens' share  
   *The CM computes, labels and routes the facts. The allocation method, any lien strategy and everything said to John Doe about value are Atty. Thorne's, and a reduction goes on the sheet only once agreed in writing.*
8. On 10/06/2026 both UM layers are resolved ($30,000.00) and no lien reduction is agreed: Peach State asserts $1,860.00 and Riverton Spine & Rehab stands at $6,105.00 audited. With the 33⅓% fee and $486.75 in costs, what does Stream 2 project to John Doe?  
   **✓ $13,661.19** · $15,269.94 · $11,548.25 · $13,522.44  
   *$30,000.00 – $10,000.00 fee – $365.06 costs (75%) – $1,395.00 – $4,578.75 (liens at 75%) = $13,661.19. $15,269.94 assumes reductions nobody has agreed to; $11,548.25 charges all costs and liens to the UM stream; $13,522.44 uses Riverton's billed $6,290.00, duplicate included.*
9. John Doe calls on 10/07/2026: “So I'm getting about $13,600 from the UM money?” What does the Case Manager say?  
   “Yes, $13,661.19, to the cent.” · “More than that: the liens always come down, so expect around $15,000.” · **✓ “The sheet is a projection: some figures are still moving. Atty. Thorne will go through it with you,” and the call is logged and routed to him.** · “Less than that: the BI money has to cover the fee first.”  
   *The figure is a projection with the liens unreduced, and explaining it to John Doe is Atty. Thorne's. The CM quotes no net, predicts no reduction and routes the call.*
10. Keystone's 08/14/2026 cover letter holds its check until each UM carrier's consent and subrogation waiver arrives. Which carriers do you ask?  
   **✓ Harbor Point and Cardinal State: John Doe's Host UM and Relative UM layers** · Harbor Point, Cardinal State and Bluewater Auto · Bluewater Auto only, because it insures the Doe household's car · None: Keystone asks the UM carriers itself  
   *Harbor Point ($20,000) and Cardinal State ($10,000) are the UM layers; both were asked 08/13 and answered 08/24 and 08/26/2026. Bluewater is Margaret's Civic policy with UM rejected in writing (03/14/2024): there is no UM layer to waive.*
11. Auditing Keystone's draft release, which clause do you call “pull”?  
   The $10,000.00 consideration · **✓ The confidentiality clause: no term of the demand, and it would bar proof of exhaustion to the UM carriers** · The non-admission of liability · The notary block  
   *Confidentiality was never a term of the demand, and the UM carriers need the release as proof of exhaustion. The consideration, non-admission and notary block match the demand and are kept; the decision on every amendment is Atty. Thorne's.*
12. Dana Whitfield asks whether Mr. Doe can sign Keystone's standard form now, with the changes in a side letter. What do you do?  
   Agree, if she confirms the side letter by email · Send John Doe the form so the check is not delayed · **✓ Tell her nothing goes to the client for signature but the release Atty. Thorne approves, and route her email to him the same day** · Tell her the catch-all clause is unenforceable anyway  
   *Release wording and the timing of signature are Atty. Thorne's. The Case Manager neither agrees nor argues the law; the request is logged and routed the same day.*
13. At the 08/28/2026 signing session John Doe asks, “What am I giving up by signing paragraph 3?” What does the Case Manager say?  
   “Nothing important; it's standard.” · “It means you can't come back for more money later.” · **✓ “Atty. Thorne will go through every paragraph with you before you sign; I'll make sure you have that time.”** · “Sign now and ask him later.”  
   *Explaining a clause is legal advice. The Case Manager confirms the logistics (ID, notary, initials, original) and makes sure Atty. Thorne goes through the release with John Doe before he signs.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Math accuracy | $1,166.67 fee, $486.75 costs, $1,846.58 against $7,965.00, net $0.00 |
| 🤖 AI | **15%** | Gap rebuttal | Four dated documents; Dr. Park's sentence quoted exactly |
| 🤖 AI | **20%** | Baseline and offset | PIP exhausted and non-subrogated; add-on UM per the 03/02/2026 letter; Relative UM above $30,000; what PIP would change |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | No verbal acceptance under pressure; every number and decision routed through Atty. Thorne |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 1 is the keystone. A trainee who can't show that $3,500 nets John Doe $0.00 has been negotiating without a floor; re-teach the battle map before moving on.
- Put question 6 to the room aloud before anyone writes: “The offer dies at 5:00 p.m. and Atty. Thorne is unreachable. What do you say?” The right answer refuses a verbal yes without rejecting the offer, asks for the offer and its deadline in writing, logs the words, and reaches Atty. Thorne. It never accepts or rejects for John Doe.
- On question 3, listen for the difference between “no set-off here” and “no reduction anywhere.” The file is clean because Harbor Point said so in writing on 03/02/2026, not because the doctrine doesn't exist.
- UPL is a gate: a strong score does not survive an ethics breach.

---

### 3.1.16 Lien Reduction Verification

> **Knowledge Check** · Day 3 — Lien negotiation & disbursement · Module 3: Lien Negotiation & Disbursement · scored with Lien Reduction Verification (`d3m3`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe VS Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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
