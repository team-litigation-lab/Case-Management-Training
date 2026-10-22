#!/usr/bin/env node
/* John Doe v. Robert Smith — the case's money, in one place.
   ---------------------------------------------------------------------------
   The file's figures used to live as typed strings in thirty-odd places: the
   data file, the slides, the trainer scripts, the simulation, the exhibits,
   the case documents, the Net Sheet, the README and the curriculum notes. One
   coverage change meant several hundred hand edits, and a figure that was
   missed stayed wrong until someone noticed — a blanket rename once left the
   glossary with two "PIP" keys and a line reading "PIP valuation doctrine
   carried over to PIP", and a binder written against an older file shipped a
   lien total that no longer existed.

   So the spine is declared once, here, and derived rather than typed: only the
   facts a document proves are written down (a charge, a payment, a limit, a
   rate, an accepted reduction), and every total, net and share is computed
   from them. Change a fact and the whole spine moves with it.

       node build/case-flow/figures.cjs            print the spine
       node build/case-flow/figures.cjs --check    validate it (CI)

   The check (check-figures.cjs runs it against the content) proves three
   things: the arithmetic here is internally consistent; no file still states a
   figure this spine has retired; and the figures the Net Sheet grades are the
   ones computed here. It does not try to police every dollar in the course —
   premiums, policy limits and PD figures are facts of their own, and a
   document is free to state them. */
"use strict";

// half-up to the cent, nudged past binary error: 10,457.625 must round to 10,457.63, not 10,457.62
const r2 = n => (n < 0 ? -1 : 1) * Math.round(Math.abs(n) * 100 + 1e-6) / 100;
const pct = n => (n < 0 ? -1 : 1) * Math.round(Math.abs(n) * 10000 + 1e-6) / 100;
const sum = xs => r2(xs.reduce((a, b) => a + b, 0));
const money = n => (n < 0 ? "–" : "") + "$" + Math.abs(r2(n)).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});

/* ---------- the facts, each proved by a document on the file ---------- */
const FACTS = {
  // the Recovery Stack: the only three coverages that pay the claim (RS27, RS28, RS29)
  recovery: {bi: 10000, hostUm: 20000, relativeUm: 10000},
  // the retainer's fee tiers (RS05), as rationals: 33⅓% is exactly one third, not 33.33%
  fee: {preSuit: [1, 3], suited: [2, 5]},
  // the receipted costs (RS44 pre-suit; the litigation costs on the Track B ledger)
  costs: {
    preSuit: {policeReport: 25, recordsAndBilling: 214.75, certifiedMail: 72, mriDisc: 25, postageAndCopies: 150},
    litigation: {filing: 218, service: 285, mediation: 1200, arbitration: 900, courtReporter: 645.5, certifiedRecords: 160}
  },
  // the medical charges as billed, and what each payer paid (RS22–RS26, RS31)
  bills: {
    urgentCare: {billed: 685, pip: 685},
    spineRehab: {billed: 6290, duplicate: 185, medPay: 1480},   // 34 lines, 33 visits: the 05/04/2026 line is billed twice
    orthopedics: {billed: 1920, pip: 1920},
    mri: {billed: 2395, pip: 2395},
    painManagement: {billed: 3400, healthPlan: 1860, writeOff: 1540},   // in network: the write-off cannot be billed to the member
    outOfPocket: {billed: 312.4}
  },
  // the first-party limits on the Escape's policy (RS28), both add-on with no reimbursement right (03/02/2026)
  firstParty: {pip: 5000, medPay: 1500},
  // lost wages (RS43)
  wages: {shifts: 9, hours: 8, rate: 22},
  // what each lienholder accepted in writing, per track (RS41, RS42 for Track A; the 2027 letters for Track B)
  liens: {
    healthPlan: {asserted: 1860, acceptedA: 1240, acceptedB: 1116},   // procurement-cost reduction at the fee actually charged
    spineRehab: {acceptedA: 3470, acceptedB: 3240}
  },
  // the planted overstatement on the draft binder Lien Sheets: PIP wrongly claimed as a lien (RS70)
  plantedPipLien: 5000,
  // how the disbursement splits between the BI stream and the UM stream (d3m4-a1)
  streamSplit: {bi: 0.25, um: 0.75}
};

/* ---------- the spine, computed ---------- */
function spine(f = FACTS) {
  const gross = sum([f.recovery.bi, f.recovery.hostUm, f.recovery.relativeUm]);
  const costsPreSuit = sum(Object.values(f.costs.preSuit));
  const costsLitigation = r2(costsPreSuit + sum(Object.values(f.costs.litigation)));
  const b = f.bills;

  // the medical Specials: billed, less the audit's correction
  const billedMedical = sum([b.urgentCare.billed, b.spineRehab.billed, b.orthopedics.billed, b.mri.billed, b.painManagement.billed, b.outOfPocket.billed]);
  const medical = r2(billedMedical - b.spineRehab.duplicate);
  const wages = r2(f.wages.shifts * f.wages.hours * f.wages.rate);
  const specials = r2(medical + wages);

  // Riverton's LOP account: audited for the duplicate, then credited with MedPay's payments
  const spineRehabAudited = r2(b.spineRehab.billed - b.spineRehab.duplicate);
  const spineRehabOwed = r2(spineRehabAudited - b.spineRehab.medPay);
  const spineRehabLedgerBalance = r2(b.spineRehab.billed - b.spineRehab.medPay);   // as the provider's own ledger shows it, duplicate still in
  const medPayUnused = r2(f.firstParty.medPay - b.spineRehab.medPay);
  // what every payer has paid plus what is still owed: the audited medical less the in-network write-off
  const paidAndOwed = r2(f.firstParty.pip + f.liens.healthPlan.asserted + b.spineRehab.medPay + spineRehabOwed + b.outOfPocket.billed);

  // the open liens: the health plan's claim and what is left of the LOP account
  const liensAudited = r2(f.liens.healthPlan.asserted + spineRehabOwed);
  const draftLienSheet = r2(liensAudited + f.plantedPipLien);

  const track = ([num, den], costs, acceptedHealthPlan, acceptedSpineRehab) => {
    const fee = r2(gross * num / den);
    const liensPaid = r2(acceptedHealthPlan + acceptedSpineRehab);
    return {
      gross, fee, costs, liensPaid,
      negotiated: r2(liensAudited - liensPaid),
      deductions: r2(fee + costs + liensPaid),   // what comes off the gross before the client's share
      net: r2(gross - fee - costs - liensPaid),
      healthPlan: acceptedHealthPlan, spineRehab: acceptedSpineRehab,
      healthPlanReduction: r2(f.liens.healthPlan.asserted - acceptedHealthPlan)
    };
  };
  const A = track(f.fee.preSuit, costsPreSuit, f.liens.healthPlan.acceptedA, f.liens.spineRehab.acceptedA);
  const B = track(f.fee.suited, costsLitigation, f.liens.healthPlan.acceptedB, f.liens.spineRehab.acceptedB);

  // Track A disbursed down two streams: the BI check, then the two UM checks
  const streams = (() => {
    const s = f.streamSplit, [num, den] = f.fee.preSuit, biGross = f.recovery.bi, umGross = r2(f.recovery.hostUm + f.recovery.relativeUm);
    const part = (share, grossPart) => r2(grossPart - r2(grossPart * num / den) - r2(A.costs * share) - r2(A.healthPlan * share) - r2(A.spineRehab * share));
    return {
      bi: part(s.bi, biGross), um: part(s.um, umGross),
      costsBi: r2(A.costs * s.bi), costsUm: r2(A.costs * s.um),
      healthPlanBi: r2(A.healthPlan * s.bi), healthPlanUm: r2(A.healthPlan * s.um),
      spineRehabBi: r2(A.spineRehab * s.bi), spineRehabUm: r2(A.spineRehab * s.um)
    };
  })();

  // what the BI layer alone would have left, and how it would have been shared out
  const biOnlyAvailable = r2(f.recovery.bi - r2(f.recovery.bi * f.fee.preSuit[0] / f.fee.preSuit[1]) - A.costs);
  const proRata = {
    available: biOnlyAvailable,
    healthPlan: r2(biOnlyAvailable * f.liens.healthPlan.asserted / liensAudited),
    spineRehabPct: pct(spineRehabOwed / liensAudited),
    healthPlanPct: pct(f.liens.healthPlan.asserted / liensAudited),
    shortfall: r2(biOnlyAvailable - liensAudited)
  };
  proRata.spineRehab = r2(biOnlyAvailable - proRata.healthPlan);

  // the gross the file needs just to bring the client to $0.00 on unreduced liens
  const [fn, fd] = f.fee.preSuit;
  const netFloor = {
    liensAndCosts: r2(liensAudited + A.costs),
    gross: r2(r2(liensAudited + A.costs) * fd / (fd - fn))   // grossed up for the fee: liens and costs come out of what is left
  };
  // the Net Sheet's stages: what it reaches as the money arrives
  const stages = {
    bi: {gross: f.recovery.bi, fee: r2(f.recovery.bi * fn / fd), costs: A.costs, liens: liensAudited,
         net: r2(f.recovery.bi - r2(f.recovery.bi * fn / fd) - A.costs - liensAudited)},
    um: {gross, fee: A.fee, costs: A.costs, liens: liensAudited, net: r2(gross - A.fee - A.costs - liensAudited)}
  };

  return {gross, costsPreSuit, costsLitigation, billedMedical, medical, wages, specials, paidAndOwed,
    spineRehabAudited, spineRehabOwed, spineRehabLedgerBalance, medPayUnused,
    liensAudited, draftLienSheet, A, B, streams, proRata, netFloor, stages};
}

/* ---------- figures this spine has retired: no file may state them again ----------
   Each entry is a figure the file once carried and the reason it is gone, so a
   stale copy of the old spine fails the check instead of quietly shipping. */
const RETIRED = [
  ["$7,965.00", "open liens before MedPay paid Riverton's first eight visits; now $6,485.00"],
  ["$8,451.75", "liens plus costs at the old lien total; now $6,971.75"],
  ["$12,677.63", "the net floor at the old lien total; now $10,457.63"],
  ["$4,580.00", "Riverton's Track A payoff on the old balance; now $3,470.00"],
  ["$4,275.00", "Riverton's Track B payoff on the old balance; now $3,240.00"],
  ["$5,820.00", "Track A's reduced liens; now $4,710.00"],
  ["$5,391.00", "Track B's reduced liens; now $4,356.00"],
  ["$20,359.92", "Track A's net; now $21,469.92"],
  ["$14,713.75", "Track B's net; now $15,748.75"],
  ["$5,089.98", "the BI stream's net; now $5,367.48"],
  ["$15,269.94", "the UM stream's net; now $16,102.44"],
  ["$1,443.15", "the health plan's BI-only pro-rata share; now $1,772.50"],
  ["$4,736.77", "Riverton's BI-only pro-rata share; now $4,407.42"],
  ["$12,965.00", "the draft binder Lien Sheet's overstatement; now $11,485.00"],
  ["$15,545.00", "a second, inconsistent figure for the same draft Lien Sheet; it is $11,485.00"],
  ["$2,145.00", "what the Track A reductions negotiated away; now $1,775.00"],
  ["$1,145.00", "Riverton's BI-stream share of its payoff; now $867.50"],
  ["$3,435.00", "Riverton's UM-stream share of its payoff; now $2,602.50"],
  ["$19,640.08", "Track A's deductions at the old lien total; now $18,530.08"],
  ["$18,214.92", "the Net Sheet's UM-stage net before the reductions, at the old lien total; now $19,694.92"]
];

/* ---------- the figures the Net Sheet grades, by stage and cell (js/cm-net-sheet.js STAGES) ---------- */
function netSheet(s = spine()) {
  return {
    bi: {L7: s.stages.bi.gross, L11: s.stages.bi.fee, L20: s.stages.bi.costs, I26: s.spineRehabOwed,
         I44: s.liensAudited, L44: s.liensAudited, L52: s.stages.bi.net},
    um: {L7: s.gross, L11: s.A.fee, I26: s.spineRehabOwed, I44: s.liensAudited, L44: s.liensAudited, L52: s.stages.um.net},
    liens: {I26: s.spineRehabOwed, I44: s.liensAudited, L30: s.A.healthPlan, L26: s.A.spineRehab, L44: s.A.liensPaid},
    final: {L7: s.gross, L11: s.A.fee, L20: s.A.costs, L26: s.A.spineRehab, L30: s.A.healthPlan, L44: s.A.liensPaid, L52: s.A.net},
    litigation: {L7: s.gross, L11: s.B.fee, L20: s.B.costs, I26: s.spineRehabOwed, L26: s.B.spineRehab, L30: s.B.healthPlan, L44: s.B.liensPaid, L52: s.B.net}
  };
}

/* ---------- is the spine internally consistent? ---------- */
function check(s = spine()) {
  const fails = [];
  const eq = (what, got, want) => { if (Math.abs(got - want) >= 0.005) fails.push(`${what}: ${money(got)}, expected ${money(want)}`); };
  eq("the gross is the three stack layers", s.gross, 40000);
  eq("the Specials are the audited medical plus the wages", s.specials, r2(s.medical + s.wages));
  eq("paid-and-owed is the audited medical less the in-network write-off", s.paidAndOwed, r2(s.medical - FACTS.bills.painManagement.writeOff));
  eq("Riverton's audited charges are the billed less the duplicate", s.spineRehabAudited, 6105);
  eq("Riverton owes the audited charges less MedPay", s.spineRehabOwed, r2(s.spineRehabAudited - FACTS.bills.spineRehab.medPay));
  eq("the open liens are the health plan's claim plus what Riverton is owed", s.liensAudited, r2(FACTS.liens.healthPlan.asserted + s.spineRehabOwed));
  // MedPay is exhausted because what is left cannot cover the next visit — the invariant, not the exact $20.00
  const visit = FACTS.bills.spineRehab.billed / 34;
  if (s.medPayUnused < 0) fails.push(`MedPay paid ${money(FACTS.bills.spineRehab.medPay)} against a ${money(FACTS.firstParty.medPay)} limit: more than the coverage`);
  else if (s.medPayUnused >= visit) fails.push(`MedPay has ${money(s.medPayUnused)} of its limit left, enough for another ${money(visit)} visit: it is not exhausted, so the LOP should have carried less`);
  for (const [t, k] of [[s.A, "A"], [s.B, "B"]]) {
    eq(`Track ${k}'s net is the gross less fee, costs and liens`, t.net, r2(s.gross - t.fee - t.costs - t.liensPaid));
    eq(`Track ${k}'s liens paid are the two accepted figures`, t.liensPaid, r2(t.healthPlan + t.spineRehab));
  }
  eq("the two Track A streams add back to its net", r2(s.streams.bi + s.streams.um), s.A.net);
  for (const [t, k] of [[s.A, "A"], [s.B, "B"]]) eq(`Track ${k}'s deductions and net make up the gross`, r2(t.deductions + t.net), s.gross);
  eq("the BI-only pro-rata shares add back to what was available", r2(s.proRata.healthPlan + s.proRata.spineRehab), s.proRata.available);
  eq("the pro-rata percentages add to 100", r2(s.proRata.healthPlanPct + s.proRata.spineRehabPct), 100);
  eq("the net floor grosses up the liens and costs for the fee", r2(s.netFloor.gross * (FACTS.fee.preSuit[1] - FACTS.fee.preSuit[0]) / FACTS.fee.preSuit[1]), s.netFloor.liensAndCosts);
  eq("the BI layer alone falls short of the liens", s.stages.bi.net, s.proRata.shortfall);
  if (s.proRata.shortfall >= 0) fails.push(`the BI layer alone now covers the liens (${money(s.proRata.shortfall)}): "BI alone leaves John Doe nothing" no longer holds, and the lessons that rest on it need rewriting`);
  // a retired figure must not be a live one
  const live = new Set(Object.values(netSheet(s)).flatMap(x => Object.values(x)).map(n => money(n)));
  for (const [fig, why] of RETIRED) if (live.has(fig)) fails.push(`${fig} is listed as retired (${why}) but the spine still produces it`);
  return fails;
}

/* ---------- the tokens the content writes instead of a figure ----------
   A lesson, a slide, a trainer script, an exhibit audit or a case document writes {{openLiens}} where it means the
   open liens, and js/cm-figures.js substitutes the figure at run time — the same way js/cm-case-dates.js rewrites
   the case's dates in place. Change a fact in FACTS and the lessons and the practice case follow it; nothing is
   typed twice. A figure that is a fact of its own (a premium, a policy limit, the PD schedule) stays written out. */
function tokens(s = spine()) {
  const t = {
    gross: s.gross,
    feePreSuit: s.A.fee, feeSuited: s.B.fee,
    costsPreSuit: s.A.costs, costsLitigation: s.B.costs,
    specials: s.specials, medicalAudited: s.medical, wages: s.wages,
    spineRehabBilled: FACTS.bills.spineRehab.billed, spineRehabDuplicate: FACTS.bills.spineRehab.duplicate,
    spineRehabAudited: s.spineRehabAudited, spineRehabMedPay: FACTS.bills.spineRehab.medPay,
    spineRehabOwed: s.spineRehabOwed, spineRehabLedgerBalance: s.spineRehabLedgerBalance,
    medPayLimit: FACTS.firstParty.medPay, medPayUnused: s.medPayUnused, pipLimit: FACTS.firstParty.pip,
    healthPlanAsserted: FACTS.liens.healthPlan.asserted,
    openLiens: s.liensAudited, draftLienSheet: s.draftLienSheet,
    // Track A, settled before suit
    payoffA: s.A.spineRehab, healthPlanA: s.A.healthPlan, liensPaidA: s.A.liensPaid,
    healthPlanReductionA: s.A.healthPlanReduction, negotiatedA: s.A.negotiated,
    deductionsA: s.A.deductions, netA: s.A.net,
    streamBi: s.streams.bi, streamUm: s.streams.um,
    costsBi: s.streams.costsBi, costsUm: s.streams.costsUm,
    healthPlanBi: s.streams.healthPlanBi, healthPlanUm: s.streams.healthPlanUm,
    payoffBi: s.streams.spineRehabBi, payoffUm: s.streams.spineRehabUm,
    // Track B, won at arbitration
    payoffB: s.B.spineRehab, healthPlanB: s.B.healthPlan, liensPaidB: s.B.liensPaid,
    healthPlanReductionB: s.B.healthPlanReduction, netB: s.B.net,
    // the BI layer alone, and the floor it sets
    biOnlyLeft: s.proRata.available, biOnlyShortfall: Math.abs(s.proRata.shortfall),
    proRataHealthPlan: s.proRata.healthPlan, proRataSpineRehab: s.proRata.spineRehab,
    netFloorLiensAndCosts: s.netFloor.liensAndCosts, netFloor: s.netFloor.gross,
    // the Net Sheet's stages
    netSheetBi: s.stages.bi.net, netSheetUm: s.stages.um.net, feeBiStage: s.stages.bi.fee,
    paidAndOwed: s.paidAndOwed, writeOff: FACTS.bills.painManagement.writeOff
  };
  return t;
}
const PCT_TOKENS = s => ({proRataHealthPlanPct: s.proRata.healthPlanPct, proRataSpineRehabPct: s.proRata.spineRehabPct});

module.exports = {FACTS, spine, netSheet, check, RETIRED, money, r2, pct, tokens, PCT_TOKENS};

if (require.main === module) {
  const s = spine(), fails = check(s);
  if (process.argv.includes("--check")) {
    if (fails.length) { console.error(`The case's money does not add up:\n${fails.map((f, i) => `${i + 1}. ${f}`).join("\n")}`); process.exit(1); }
    console.log(`The case's money adds up: gross ${money(s.gross)} · open liens ${money(s.liensAudited)} · Track A net ${money(s.A.net)} · Track B net ${money(s.B.net)} · ${RETIRED.length} retired figures`);
  } else {
    const line = (k, v) => console.log(`  ${k.padEnd(34)} ${money(v)}`);
    console.log("John Doe v. Robert Smith — the money\n");
    console.log(" Recovery and Specials");
    line("Gross recovery", s.gross); line("Medical, audited", s.medical); line("Lost wages", s.wages); line("Specials", s.specials);
    console.log("\n First-party payments and the LOP");
    line("Riverton billed", FACTS.bills.spineRehab.billed); line("  less the 05/04/2026 duplicate", -FACTS.bills.spineRehab.duplicate);
    line("  audited charges", s.spineRehabAudited); line("  less MedPay", -FACTS.bills.spineRehab.medPay); line("  owed under the LOP", s.spineRehabOwed);
    line("Open liens", s.liensAudited); line("Draft Lien Sheet, as planted", s.draftLienSheet);
    console.log("\n Track A — settled before suit");
    line("Fee (33⅓%)", s.A.fee); line("Costs", s.A.costs); line("Liens paid", s.A.liensPaid); line("Net to John Doe", s.A.net);
    line("  BI stream", s.streams.bi); line("  UM stream", s.streams.um);
    console.log("\n Track B — won at arbitration");
    line("Fee (40%)", s.B.fee); line("Costs", s.B.costs); line("Liens paid", s.B.liensPaid); line("Net to John Doe", s.B.net);
    console.log("\n The BI layer alone");
    line("Left after fee and costs", s.proRata.available); line("Against open liens", s.liensAudited); line("Shortfall", s.proRata.shortfall);
    line(`  health plan (${s.proRata.healthPlanPct}%)`, s.proRata.healthPlan); line(`  Riverton (${s.proRata.spineRehabPct}%)`, s.proRata.spineRehab);
    line("Net floor, gross needed for $0.00", s.netFloor.gross);
    if (fails.length) { console.error(`\n${fails.length} problem(s):\n${fails.map((f, i) => `${i + 1}. ${f}`).join("\n")}`); process.exit(1); }
  }
}
