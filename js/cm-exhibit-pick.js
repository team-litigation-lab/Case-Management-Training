/* 📎 Choose the exhibits: on the demand draft (RS33) and its draft exhibit packet (RS66), the Case Manager picks from
   John Doe's file which documents go into the BI Time-Limited Demand as exhibits, and which stay out, then checks the
   set. The answers are the Exhibit Index as served (RS67): Exhibits A–J, 81 pages, and what was pulled from the draft
   and why. Shown by case-doc.html; each trainee's picks are kept in this browser. */
(function(){
"use strict";
const IN = "in", OUT = "out";
const SET = [
  {doc: "RS07", what: "Riverton PD Traffic Crash Report RPD-26-018842", want: IN, ex: "A",
   why: "Liability: Robert Smith cited for failure to stop. A certified copy, 6 pages."},
  {doc: "RS08", what: "Witness statement — Ruth Calloway", want: IN, ex: "B",
   why: "The independent witness to the collision, signed."},
  {doc: "RS09", what: "Doorbell video — stills and chain of custody", want: IN, ex: "C",
   why: "Color stills exported from the native file, with the preservation and chain-of-custody log; the video on USB."},
  {doc: "RS11", what: "Riverton Fire EMS Run Report", want: IN, ex: "D",
   why: "Injury at the scene, certified: it ties the neck complaint to 02/06/2026."},
  {doc: "RS23", what: "Riverton Spine & Rehab itemized LOP ledger, audited against the attendance log", want: IN, ex: "E",
   why: "The medical records and bills in treatment order: 33 visits × $185.00 = $6,105.00, the duplicate 05/04/2026 line struck."},
  {doc: "RS73", what: "Crescent Pain & Spine corrected patient statement, $0.00 (07/10/2026)", want: IN, ex: "E",
   why: "With Peach State's EOB: Crescent is in network, so the member owes $0.00. The corrected statement goes in, not the old one."},
  {doc: "RS16", what: "Summit Imaging cervical MRI report, with the corrected history addendum (RS72)", want: IN, ex: "F",
   why: "The objective finding, with the addendum that corrects the date of injury to 02/06/2026."},
  {doc: "RS19", what: "Dr. Alana Reyes — Causation Letter (06/19/2026)", want: IN, ex: "G",
   why: "Ties the injury to this collision, to a reasonable degree of medical probability: the answer to the gap."},
  {doc: "RS43", what: "Northgate Distribution wage-and-attendance letter", want: IN, ex: "H",
   why: "The $1,584.00 wage loss, and the 02/09–02/13/2026 call-outs that show symptoms before first treatment."},
  {doc: "", what: "Gap Explanation Record (your Day 2 work)", want: IN, ex: "I",
   why: "The fourteen days to first care and the nineteen-day April disruption, each entry with its underlying record, so Keystone can't call it failure to mitigate."},
  {doc: "RS27", what: "Keystone Mutual declarations page and limits letter (03/20/2026)", want: IN, ex: "J",
   why: "The proof that $10,000 is the per-person bodily injury limit the demand asks for."},
  {doc: "RS04", what: "Master Case Summary — Attorney Only", want: OUT,
   why: "Attorney work product: it names our gap risk and our valuation. It never goes to an adverse carrier."},
  {doc: "RS06", what: "HIPAA Authorization (claim-specific)", want: OUT,
   why: "An authorization is how the firm gets records. Keystone receives the records we choose to enclose, not a route to his whole medical file."},
  {doc: "", what: "Margaret Doe's Civic: repair estimate, supplement and Diminished Value report", want: OUT,
   why: "Her property damage claim (KM-26-440871-PD), not Mr. Doe's. Enclosing it invites a release that reaches her Civic."},
  {doc: "", what: "Crescent patient statement, $1,540.00 due from patient", want: OUT,
   why: "Replaced by the corrected $0.00 statement: the $1,540.00 was a contractual adjustment Crescent can't bill to the member."},
  {doc: "", what: "Riverton Spine & Rehab 34-line ledger, $6,290.00, as billed", want: OUT,
   why: "05/04/2026 was billed twice. The ledger audited against the attendance log ($6,105.00) goes in instead."},
  {doc: "RS64", what: "CMS Task Log — Pre-Demand Audit Closed, Drafting Assigned", want: OUT,
   why: "The firm's own internal record of the work. Nothing internal goes in a Demand Package."}
];
// a fixed mix, so the list gives nothing away by its order (the same for everyone)
const order = SET.map((x, i) => i);
let h = 7; for(let i = order.length - 1; i > 0; i--){ h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
window.CM_EXHIBIT_PICK = {
  docs: ["RS33", "RS66"],
  title: "📎 Choose the exhibits",
  intro: "Which of these from John Doe's file go into the BI Time-Limited Demand as exhibits, and which stay out? Choose for each one, then check your set.",
  items: order.map(i => SET[i]),
  IN, OUT
};
})();
