/* John Doe v. Robert Smith — the case's money, in the course. GENERATED, do not edit.
     node build/case-flow/figures/assemble.cjs       (from build/case-flow/figures.cjs)

   The money is declared once, in build/case-flow/figures.cjs: only the facts a document proves are written down
   (a charge, a payment, a limit, a fee tier, an accepted reduction) and every total, net, share and split is
   derived. This carries the derived figures into the program, so a lesson, a slide, a trainer script, an exhibit
   audit, a case document and the practice sheet never state a figure twice.

   How the content uses it: write {{openLiens}} where you mean the open liens, {{netA}} for Track A's net to the
   client, {{payoffA}} for the accepted LOP payoff, and so on (CM_FIGURES.tokens lists them all). Loaded after the
   Case Flow content and before js/cm-case-flow.js, this walks every string in CM_CASE_FLOW, CM_CF_SLIDES,
   CM_CF_SIM, CM_CF_DOCS, CM_CF_SCRIPTS and CM_CF_EXHIBITS and substitutes the figure in place — exactly as
   js/cm-case-dates.js rewrites the dates. A token that is not known is left alone and reported in the console, so
   a typo shows up rather than printing a blank.

   A figure that is a fact of its own — a premium, a policy limit, the Property Damage schedule, a page count —
   is written out in the content as before. This is for the spine: what the file recovers, what comes off it, and
   what reaches John Doe. */
(function(){
  "use strict";
  const money = n => (n < 0 ? "\u2013" : "") + "$" + Math.abs(n).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const F = {
    "gross": 40000,
    "feePreSuit": 13333.33,
    "feeSuited": 16000,
    "costsPreSuit": 486.75,
    "costsLitigation": 3895.25,
    "specials": 16401.4,
    "medicalAudited": 14817.4,
    "wages": 1584,
    "spineRehabBilled": 6290,
    "spineRehabDuplicate": 185,
    "spineRehabAudited": 6105,
    "spineRehabMedPay": 1480,
    "spineRehabOwed": 4625,
    "spineRehabLedgerBalance": 4810,
    "medPayLimit": 1500,
    "medPayUnused": 20,
    "pipLimit": 5000,
    "healthPlanAsserted": 1860,
    "openLiens": 6485,
    "draftLienSheet": 11485,
    "payoffA": 3470,
    "healthPlanA": 1240,
    "liensPaidA": 4710,
    "healthPlanReductionA": 620,
    "negotiatedA": 1775,
    "deductionsA": 18530.08,
    "netA": 21469.92,
    "streamBi": 5367.48,
    "streamUm": 16102.44,
    "costsBi": 121.69,
    "costsUm": 365.06,
    "healthPlanBi": 310,
    "healthPlanUm": 930,
    "payoffBi": 867.5,
    "payoffUm": 2602.5,
    "payoffB": 3240,
    "healthPlanB": 1116,
    "liensPaidB": 4356,
    "healthPlanReductionB": 744,
    "netB": 15748.75,
    "biOnlyLeft": 6179.92,
    "biOnlyShortfall": 305.08,
    "proRataHealthPlan": 1772.5,
    "proRataSpineRehab": 4407.42,
    "netFloorLiensAndCosts": 6971.75,
    "netFloor": 10457.63,
    "netSheetBi": -305.08,
    "netSheetUm": 19694.92,
    "feeBiStage": 3333.33,
    "paidAndOwed": 13277.4,
    "writeOff": 1540
  };
  const PCT = {
    "proRataHealthPlanPct": 28.68,
    "proRataSpineRehabPct": 71.32
  };
  /* the figures the practice sheet grades, by stage and cell (js/cm-net-sheet.js builds its checks from these) */
  const NET_SHEET = {
    "bi": {
      "L7": 10000,
      "L11": 3333.33,
      "L20": 486.75,
      "I26": 4625,
      "I44": 6485,
      "L44": 6485,
      "L52": -305.08
    },
    "um": {
      "L7": 40000,
      "L11": 13333.33,
      "I26": 4625,
      "I44": 6485,
      "L44": 6485,
      "L52": 19694.92
    },
    "liens": {
      "I26": 4625,
      "I44": 6485,
      "L30": 1240,
      "L26": 3470,
      "L44": 4710
    },
    "final": {
      "L7": 40000,
      "L11": 13333.33,
      "L20": 486.75,
      "L26": 3470,
      "L30": 1240,
      "L44": 4710,
      "L52": 21469.92
    },
    "litigation": {
      "L7": 40000,
      "L11": 16000,
      "L20": 3895.25,
      "I26": 4625,
      "L26": 3240,
      "L30": 1116,
      "L44": 4356,
      "L52": 15748.75
    }
  };

  const TOKEN = /\{\{([a-zA-Z]+)\}\}/g;
  const unknown = new Set();
  /* one string: {{token}} → its figure; {{tokenPct}} → its percentage */
  function text(str){
    if(typeof str !== "string" || str.indexOf("{{") < 0) return str;
    return str.replace(TOKEN, (whole, name) => {
      if(Object.prototype.hasOwnProperty.call(F, name)) return money(F[name]);
      if(Object.prototype.hasOwnProperty.call(PCT, name)) return PCT[name] + "%";
      unknown.add(name);
      return whole;
    });
  }
  /* every string in a structure, in place (ids, file paths and image names are left alone, as the dates do) */
  const KEEP = new Set(["id", "file", "folder", "image", "kind", "cms", "tool"]);
  function apply(o, seen){
    if(!o || typeof o !== "object") return o;
    seen = seen || new Set(); if(seen.has(o)) return o; seen.add(o);
    for(const key of Object.keys(o)){
      const v = o[key];
      if(typeof v === "string"){ if(!KEEP.has(key)) o[key] = text(v); }
      else if(v && typeof v === "object") apply(v, seen);
    }
    return o;
  }
  window.CM_FIGURES = {
    money, text, apply, figures: F, pct: PCT, netSheet: NET_SHEET,
    get tokens(){ return Object.keys(F).concat(Object.keys(PCT)).sort(); },
    get unresolved(){ return [...unknown]; }
  };
  ["CM_CASE_FLOW", "CM_CF_SLIDES", "CM_CF_SIM", "CM_CF_DOCS", "CM_CF_SCRIPTS", "CM_CF_EXHIBITS"].forEach(k => { if(window[k]) apply(window[k]); });
  if(unknown.size) console.warn("[cm-figures] no such figure: " + [...unknown].join(", ") + " — see build/case-flow/figures.cjs");
})();
