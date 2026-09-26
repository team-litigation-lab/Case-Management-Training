/* ============================================================
   LSH Case Management Training — Case File: snapshot, CMS build
   and the CM Mindset critical-thinking checkpoints.

   Trainees no longer get a finished case summary. They get a
   snapshot only, build the real file in the CMS from the documents,
   and work through one checkpoint per day: questions a Case Manager
   has to answer from the documents (citing them). After they submit,
   they see the answer key next to their answers and scored feedback
   on their reasoning. Trainers see the key and every trainee's work.

   Saved in the trainee's progress under "cm-mindset":
     { drafts:{cpId:{q:text}}, results:{cpId:{answers, submittedAt, attempts, best, ai}} }
   Loaded after cm-skillbuilders.js, so window.renderClientProfile here
   replaces the earlier Case File page.
   ============================================================ */
(function(){
"use strict";
const E = (s)=> (typeof esc==="function" ? esc(s) : String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
const KEY = "cm-mindset";
if(typeof PERSONAL_KEYS!=="undefined" && !PERSONAL_KEYS.includes(KEY)){ PERSONAL_KEYS.push(KEY); try{ PERSONAL_KEY_SET.add(KEY); }catch(e){} }

/* ---------------- content ---------------- */
const SNAPSHOT = [
  ["Case", "John Doe v. Apex Delivery Services, Inc. & Robert W. Smith"],
  ["LSH file / claim", "MVA-JD-2026-001 · Claim # 2026-0214-AX"],
  ["Client", "John Doe · DOB 08/14/1980 · (555) 982-4410 · johndoe@gmail.com"],
  ["Case type", "Motor vehicle collision with a commercial delivery truck"],
  ["Date of loss", "Saturday, February 14, 2026 · 2:35 PM · 4th Ave & Main St, Metro Center"],
  ["Signed up", "Retainer signed 02/15/2026"]
];

const MINDSET = [
  ["🔎", "What does it prove?", "Every fact comes from a document, and you can say which one. A summary is only a lead until you verify it."],
  ["⚖️", "What doesn't match?", "Dates, names, amounts, DOBs, entities. When two documents disagree, find out which is right and fix the file."],
  ["🚩", "What could hurt the case?", "See the defense before the adjuster does: prior injuries, gaps, missing bills, a bad release."],
  ["⏰", "What's due, what's missing?", "Deadlines, signatures, records, bills and coverage no one has asked for yet."],
  ["➡️", "What's next, and who needs to know?", "Act before you're asked. Decide the next step, and tell the attorney, the client or accounting in time."]
];

/* One checkpoint per day (two on Day 1). Each question has the key points an
   expert Case Manager would cover; the reviewer scores against them. */
const CHECKPOINTS = [
  {id:"d1-intake", day:1, title:"Intake: What Do We Really Have?",
   scenario:"The intake packet just landed on your desk. The attorney wants a two-minute rundown tomorrow morning. Don't summarize: verify, question, and decide what happens next.",
   docs:["JD01","JD02","JD03","JD04","JD05","JD06","JD07","JD22"],
   qs:[
    {q:"Who could have a claim, and who are we claiming against? What has to happen before the firm can represent more than one person?",
     key:["John Doe is the client (driver, injured).","Jane Doe, the front-seat passenger, has her own soft-tissue claim (refused EMS at the scene).","A conflict check is needed before representing both John and Jane.","Robert W. Smith, the at-fault driver (two citations in the police report).","Apex Delivery Services, which owns the commercial F-150 and employed Smith (vicarious liability; commercial policy with Aggressive Casualty)."]},
    {q:"When is the statute of limitations, which document says so, and what goes on the calendar today?",
     key:["SOL 02/14/2028, from the Master Case Summary (JD04); confirm the rule with the attorney.","Calendar the SOL with advance alerts on day one.","The HIPAA authorization (JD06) is unsigned and undated: get it signed before any records request."]},
    {q:"Find at least three discrepancies across the intake documents. For each: which document is right, and why does it matter?",
     key:["JD03 lists the occupation as 'Nurse'; every other record says Senior Logistics Manager (drives the wage claim).","JD03's 'report number 1104' is Sgt. Vance's badge number; the real report is 2026-0214-AX.","JD02 says asymptomatic for 7 years; the records show 8 (2018 → 2026).","JD04's location field is incomplete ('Generic Address').","JD04 says 'litigation was initiated', which changes the fee tier to 40% under the retainer: confirm."]},
    {q:"What in this file could hurt John's case, and what do you do about it now?",
     key:["The 2018 lumbar strain (JD22) will be the adjuster's prior-injury argument: disclose it, don't hide it.","Use the 8-year asymptomatic baseline to support aggravation of a pre-existing condition (eggshell plaintiff).","The chronic migraine history (2021) creates a risk of brain-MRI bills being mixed into the claim.","The 2-week MIA period noted at intake: find out why and document it.","Prior counsel Barry Slow has a lien ($1,200 costs + quantum meruit) that must be resolved before any disbursement.","No independent witness in the police report: the spouse is the only other occupant."]},
    {q:"What do you do in the next 48 hours, and who needs to know what?",
     key:["Run the conflict check for John and Jane; tell the attorney about Jane's potential claim.","Get the HIPAA authorization signed, then send the records requests.","Open claims / send letters of representation to Aggressive Casualty (Apex) and the client's own carrier (Local Farm Mutual) for PIP.","Key the intake into the CMS with the corrections (occupation, report number) and upload each document to the right CMS folder.","Tell the attorney about the discrepancies, the prior-injury risk, the fee-tier question and the prior counsel lien.","Explain next steps to the client and confirm contact details."]}
   ]},
  {id:"d1-treatment", day:1, title:"Treatment: Does the Medical Story Hold Together?",
   scenario:"The adjuster will read these records looking for a reason to pay less. Read them first, the way the adjuster will.",
   docs:["JD09","JD13","JD15","JD16","JD17","JD22"],
   qs:[
    {q:"The ER discharged John on 02/14 and PT didn't start until March. Is that a treatment gap? Prove your answer.",
     key:["No: the hospital records (JD09) order 14 days of strict bed rest (02/14–02/28).","A documented medical order is not a gap; cite it so the adjuster can't use it."]},
    {q:"Is there a real gap in treatment? What caused it, and how do you protect the case?",
     key:["Yes: 04/01–04/15, a 14-day gap.","PT notes a clinical withdrawal just before it (JD15); the cause was PTSD with acute dissociative withdrawal after seeing the scarring.","Get the psychological evaluation (neuropsych, Dr. Mindy Health) so the gap is explained in the demand, not left for the adjuster."]},
    {q:"Which findings in these records need action now, not at demand time?",
     key:["Foot drop in PT (JD15) is a medical danger red flag: call the provider (A-C-T).","The chiropractic plateau (JD16) means course-correct: refer to a specialist."]},
    {q:"Find the discrepancies in the medical records and billing.",
     key:["The MRI report (JD13) shows the wrong DOB (02/14/1980).","The MRI names 'Dr. Aris Thorne' as referring physician, who isn't a known treater; age 46 vs 45.","The chronology and demand cite the MRI as '3mm, 03/10'; the report says 5mm on 03/15: reconcile before the demand.","Chiro visits #13–#14 (03/30, 04/02) don't match the billing statement dates (03/15, 03/17): request the full ledger."]},
    {q:"What is the strongest objective evidence of injury, and why does 'objective' matter?",
     key:["The MRI: 5mm L4-L5 protrusion impinging the left L5 nerve root.","The EMG (04/20): active denervation, left L5, objective proof of nerve damage.","Adjusters discount subjective pain; imaging, EMG and surgery can't be argued away."]}
   ]},
  {id:"d2-demand", day:2, title:"The Demand: Would You Send This?",
   scenario:"A draft demand is ready to go to Aggressive Casualty. Your name is on the file. Audit it as if the adjuster will check every number, because they will.",
   docs:["JD29","JD24","JD25","JD23","JD19","JD26","JD27","JD32"],
   qs:[
    {q:"Audit the specials table in the demand (JD29). What is wrong?",
     key:["'Fire Dept' extrication $1,850 is really the EMS ALS transport.","ER listed at $12,400; the bill is $12,700.","Plastic reconstruction $3,200 has no bill on file.","MRI $2,100 is the brain MRI amount, under the wrong entity name.","Chiro $8,400 vs a $320 statement.","Future care $15,000 on page 2 vs $57,000 on page 18.","The MRI is cited as '3mm, 03/10' (it's 5mm, 03/15)."]},
    {q:"What is missing from the specials?",
     key:["The surgeon's bill.","The anesthesia bill: an independent group (JD19), billed separately.","The facility bill for the surgery.","PT bills and the EMC (Dr. Spine) bills."]},
    {q:"Which documents give the demand its strength, and which defense does each one defeat?",
     key:["EMS run report (JD08): objective severity, defeats a 'low-speed' argument.","Negative BAC and drug screen (JD10): no impairment or comparative-fault argument.","Facial surgical repair (JD11): permanent disfigurement, a strong general-damages driver.","Neuropsych evaluation (JD18): reframes the treatment gap.","Lost wages $15,900 (JD32) with payroll and the RTW note."]},
    {q:"Where will the money come from, and what coverage issues do you need to manage?",
     key:["PIP ($10,000, with the EMC) is already exhausted (JD26): remaining bills go to health insurance or an LOP.","Aggressive Casualty (Apex) denied property damage: the Tesla ($42,500 total loss) goes through John's collision coverage ($1,000 deductible) and subrogation.","UM with Local Farm Mutual is only available once BI is exhausted: protect it."]},
    {q:"What do you tell the attorney before this demand goes out?",
     key:["That the demand can't go out as drafted: list the specials errors and missing bills.","The MRI facts need to be corrected and the chronology fixed.","Ask for the missing bills (surgeon, anesthesia, facility, PT) before sending.","Flag the brain-MRI billing risk given the migraine history."]}
   ]},
  {id:"d3-net", day:3, title:"Liens & the Release: Protect the Client's Net",
   scenario:"The case is close to settling. The defense sent a release and the lienholders are lining up. One mistake here comes straight out of John's pocket, or the firm's.",
   docs:["JD33","JD30","JD31","JD28","JD42","JD05"],
   qs:[
    {q:"Audit the proposed release (JD33). What would you refuse to let the client sign, and why?",
     key:["A global release of unknown/future injuries.","§II makes the client AND counsel personally liable to defend and pay liens.","§III waives UM/UIM, which destroys the Local Farm Mutual claim.","The lien ledger only lists the $11,200 Global Health lien and omits Metro General, BlueCross ERISA and prior counsel.","'Disregarding ongoing clinical therapies'.","It says $100,000 against a $1,000,000 CSL policy.","Counter with the Standard Safe Release."]},
    {q:"Go through the liens. Which are questionable, which may be duplicates, and how would you reduce them?",
     key:["Global Health Blue-Shield ($11,200) doesn't match the client's plan (BCBS ERISA BC-441-A): verify whether it's the same interest as the BlueCross $20,000 notice. Never pay both.","Metro General's $45,000 lien vs its own $12,700 bill: PIP and health insurance already paid part (double recovery).","BlueCross is self-funded ERISA: Made Whole and Common Fund don't apply unless agreed in writing, so reduce by audit/itemization and negotiation.","Barry Slow: acknowledge the lien but challenge clerical hours billed as overhead."]},
    {q:"What must happen before any BI release is signed, to protect the UM claim?",
     key:["Get the UM carrier's (Local Farm Mutual) written Consent to Settle before the BI release (JD28)."]},
    {q:"A $1,200 radiology bill (JD42) arrives after closing. Whose problem is it, and what do you do?",
     key:["It's accident-related (post-op follow-up referred by the surgeon) and wasn't on the ledger.","The release's indemnity clause makes it the claimant's obligation.","The firm owns the missed records sweep: tell the attorney and the client, and negotiate the bill."]},
    {q:"Before you run the net sheet, what two retainer terms change the numbers?",
     key:["The fee tier: 33⅓% pre-suit, 40% once a lawsuit is filed. Check whether suit was filed.","Costs come off the gross BEFORE the fee is calculated (§4); the Net Sheet template calculates the fee on gross, so flag it to the attorney."]}
   ]},
  {id:"d4-trial", day:4, title:"Mediation & Arbitration: Is the File Trial-Ready?",
   scenario:"You're building the mediation binder and the arbitration hearing is on the calendar. Opposing counsel will read everything in the binder. The arbitrator will notice everything that's late.",
   docs:["JD04","JD34","JD35","JD36","JD37","JD38","JD40","JD41"],
   qs:[
    {q:"What must NOT go into the binder, and why?",
     key:["The Master Case Summary (JD04): internal attorney work product.","The original complaint (JD34): superseded by the First Amended Complaint.","The grayscale fax scene photo (JD40): QC fail, get the investigator's color originals."]},
    {q:"What could stop the hearing or blow a deadline this week?",
     key:["The claimant's $4,800 AAA deposit is outstanding (JD38): the hearing won't proceed. Route it to accounting today.","The arbitration brief (JD41) sections III–IV (prior-injury shield, verified ledger) must be done before 06/18 at 5 PM.","Every date in the Scheduling Order (JD37) goes on the master calendar with alerts."]},
    {q:"Read the Answer (JD36). What does the defense NOT have, and why does that matter at mediation?",
     key:["No seatbelt defense was pleaded.","If it's raised at mediation or arbitration, the attorney can object."]},
    {q:"Suit has been filed (JD35). What changes on the money side?",
     key:["The retainer's fee tier moves to 40%.","Update the net sheet and settlement projections, and make sure the client understands."]},
    {q:"Your attorney asks: 'Is there anything I don't know yet?' What do you say?",
     key:["The outstanding AAA deposit.","The unfinished brief sections and the deadline.","The binder exclusions (work product, superseded complaint, grayscale exhibit).","No seatbelt defense was pleaded.","The 40% fee tier and its effect on the client's net."]}
   ]},
  {id:"d5-davies", day:5, title:"Jordan Davies: Find the Money, Protect the Case",
   scenario:"A new file: Jordan Davies. High bills, a $10,000 at-fault policy, and a carrier claiming 50/50 fault. Most people would say the case is capped at $10,000. A Case Manager keeps looking.",
   docs:["JDV01","JDV02","JDV03","JDV04","JDV05","JDV06","JDV07","JDV08","JD39"],
   qs:[
    {q:"Find every policy that could pay Jordan, and every one that can't. Explain why.",
     key:["State General ($10,000 BI, at-fault driver): tender it, but get UIM consent first.","Coastal Mutual (Jordan's own policy): applies, named insured.","Allied Mutual (his mother Linda's policy): Jordan is a resident relative, so stacked UIM up to $200,000 per person. Put them on notice.","Summit Auto (brother Marcus): Marcus lives at a different address, so Jordan isn't a resident of his household. Doesn't apply."]},
    {q:"What evidence do you request today, and why today?",
     key:["City DOT camera footage.","Quick-Fuel CCTV, with a preservation letter now, because footage overwrites.","The transit authority (Route 9 driver).","Signal timing charts, 911 audio and the vehicle EDR."]},
    {q:"State General says liability is 50/50. How do you respond?",
     key:["Nothing supports it: no witnesses, no citations against Jordan.","Rebut it with objective evidence (video, signal timing, EDR, police report)."]},
    {q:"What in the treatment records needs attention right now?",
     key:["A treatment gap is forming (JDV07 PT attendance).","Talk to Jordan about continuing care; set up an LOP if needed."]},
    {q:"Back on John Doe: Requests for Admission arrived (JD39). When is the response due, and which ones worry you?",
     key:["Due 07/15/2026: 30 days + 3 for mail, trigger day excluded.","RFA #3 (seatbelt) and #4 (no permanent injury) are deadly if deemed admitted: calendar it and make sure the attorney responds on time."]}
   ]}
];

/* ---------------- state ---------------- */
let MS = null, saveTimer = null;
async function ms(){ if(!MS){ try{ MS = (await storeGet(KEY)) || {}; }catch(e){ MS = {}; } MS.drafts = MS.drafts || {}; MS.results = MS.results || {}; } return MS; }
function persist(){ clearTimeout(saveTimer); saveTimer = setTimeout(()=>{ storeSet(KEY, MS); }, 600); }
const unlocked = (day)=> state.isAdmin || typeof dayUnlocked!=="function" || dayUnlocked(day);
const pct = (n)=> n==null ? "—" : Math.round(n)+"%";

/* ---------------- page ---------------- */
window.renderClientProfile = function(){
  if(!MS){ ms().then(()=>{ if(state.view==="clientprofile") render(); }); return `<div class="card" style="padding:24px">Loading your Case File…</div>`; }
  const done = CHECKPOINTS.filter(c=>MS.results[c.id]);
  const scored = done.map(c=>MS.results[c.id].best).filter(v=>v!=null);
  const avg = scored.length ? scored.reduce((a,b)=>a+b,0)/scored.length : null;
  return `<h1 style="color:var(--navy);font-size:28px;margin:0 0 10px">📂 Case File: John Doe v. Apex Delivery Services</h1>
    <div class="client-intro-banner"><div class="cib-tag">🧠 Think Like a Case Manager</div><h2>This is only the snapshot. You build the file.</h2>
      <p>A Case Manager doesn't memorize a summary. They verify every fact against its source, catch what doesn't match, see the risk before the adjuster does, and act before anyone asks. So there's no finished case summary here: you build the file yourself <b>in the CMS</b>, from the documents, and prove your thinking in the checkpoints below.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-navy btn-sm" onclick="goto('casedocs')">📁 Open the Case Documents</button><button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 Open the CMS</button></div></div>
    <div class="cmm-top">
      <div class="card cmm-snap"><h3>📌 Case Snapshot</h3>
        <dl>${SNAPSHOT.map(([k,v])=>`<dt>${E(k)}</dt><dd>${E(v)}</dd>`).join("")}</dl>
        <p class="cmm-note">That's all you get. Injuries, treatment, coverage, deadlines and problems: find them in the documents, verify them, and cite them.</p></div>
      <div class="card cmm-mind"><h3>🧠 The CM Mindset: Ask This of Every Document</h3>
        ${MINDSET.map(([i,t,d])=>`<div class="cmm-m"><span>${i}</span><div><b>${E(t)}</b><p>${E(d)}</p></div></div>`).join("")}</div>
    </div>
    <div class="card cmm-sec"><h2>🗂 Build the File in the CMS</h2>
      <ol class="cmm-steps">
        <li><b>Create the case</b> for John Doe and key the intake from the intake documents (JD01–JD03). Where documents disagree, key the version you can prove, and add a note saying what you corrected and why.</li>
        <li><b>Upload every document</b> to the right CMS folder (each document in 📁 Case Documents shows its folder).</li>
        <li><b>Calendar every deadline</b> you find, with alerts, starting with the statute of limitations.</li>
        <li><b>Add the parties, carriers and lienholders</b> as you find them in the documents, day by day.</li>
        <li><b>Log a task</b> for every "what's next" you decide in a checkpoint, assigned to the right person.</li>
      </ol>
      ${typeof window.cmToolStep==="function" ? window.cmToolStep("cms","casefile-build","When your case is set up, log its CMS Case ID here so your trainer can review your file.") : ""}
    </div>
    <div class="cmm-sec"><div class="cmm-head"><h2>🧠 Critical-Thinking Checkpoints</h2>
      <span class="cmm-prog">${done.length} of ${CHECKPOINTS.length} submitted${avg!=null?` · average ${pct(avg)}`:""}</span></div>
      <p class="cmm-lead">One per day (two on Day 1). Answer from the documents and cite them (e.g. “JD13 says 5mm”). After you submit, you'll see the answer key next to your answers, with feedback on your reasoning.</p>
      ${CHECKPOINTS.map(renderCheckpoint).join("")}
    </div>
    ${state.isAdmin ? renderTrainerTools() : ""}`;
};

function renderCheckpoint(c){
  const res = MS.results[c.id], open = state.cmmOpen === c.id, locked = !unlocked(c.day);
  const badge = res ? `<span class="cmm-score ${res.best>=85?"good":res.best>=70?"mid":res.best!=null?"low":""}">${res.best!=null?pct(res.best):"Submitted"}</span>` : locked ? `<span class="cmm-lock">🔒 Day ${c.day}</span>` : `<span class="cmm-todo">To do</span>`;
  return `<div class="card cmm-cp ${open?"open":""}" id="cmm_${c.id}">
    <button class="cmm-cp-h" onclick="cmmToggle('${c.id}')" aria-expanded="${open}"><span class="cmm-day">Day ${c.day}</span><b>${E(c.title)}</b>${badge}<span class="cmm-chev">${open?"▾":"▸"}</span></button>
    ${open ? (locked ? `<div class="cmm-body"><p>This checkpoint opens with Day ${c.day}.</p></div>` : `<div class="cmm-body">
      <div class="cm-scn"><b>The situation:</b> ${E(c.scenario)}</div>
      ${typeof window.cmDocPacket==="function" ? window.cmDocPacket(c.docs, "Work from these documents") : ""}
      ${res && !state.cmmRedo?.[c.id] ? renderResult(c, res) : renderForm(c)}
    </div>`) : ""}
  </div>`;
}

function renderForm(c){
  const d = MS.drafts[c.id] || {};
  return `<form onsubmit="cmmSubmit(event,'${c.id}')">
    ${c.qs.map((q,i)=>`<div class="cmm-q"><label for="cmmq_${c.id}_${i}"><span class="cmm-n">${i+1}</span>${E(q.q)}</label>
      <textarea id="cmmq_${c.id}_${i}" rows="4" maxlength="3000" oninput="cmmDraft('${c.id}',${i},this.value)" placeholder="Your answer, with the document(s) that prove it…">${E(d[i]||"")}</textarea>
      ${state.isAdmin ? `<div class="cmm-key admin">🔑 Key: ${q.key.map(E).join(" · ")}</div>` : ""}</div>`).join("")}
    <div class="cmm-actions"><button class="btn btn-navy" type="submit" id="cmmsub_${c.id}">Submit and See the Key</button>
      <span class="cmm-hint">Your answers save as you type. Once you submit, you'll compare them with the key.</span></div>
  </form>`;
}

function renderResult(c, res){
  const ai = res.ai, perQ = (ai && ai.questions) || [];
  return `<div class="cmm-result">
    ${ai ? `<div class="cmm-fb"><div class="cmm-fb-score"><b>${pct(ai.score)}</b><span>${res.attempts>1?`Attempt ${res.attempts} · best ${pct(res.best)}`:"Your score"}</span></div>
      <div><p class="cmm-mindset">${E(ai.mindset||"")}</p>
      ${(ai.strengths||[]).length?`<p><b>What you did well:</b> ${ai.strengths.map(E).join(" · ")}</p>`:""}
      ${(ai.blindSpots||[]).length?`<p><b>Blind spots:</b> ${ai.blindSpots.map(E).join(" · ")}</p>`:""}</div></div>`
      : `<div class="cmm-fb"><div><p><b>Compare your answers with the key below.</b> ${res.aiError?`Automatic feedback wasn't available (${E(res.aiError)}), so check yourself honestly: every key point you missed is something to look for next time.`:""}</p></div></div>`}
    ${c.qs.map((q,i)=>{ const pq = perQ.find(x=>x.q===i+1) || {}, hit = new Set((pq.hit||[]).map(Number));
      return `<div class="cmm-q done"><div class="cmm-qh"><span class="cmm-n">${i+1}</span><b>${E(q.q)}</b>${pq.score!=null?`<span class="cmm-qs">${pq.score}/10</span>`:""}</div>
        <div class="cmm-cols"><div><div class="cmm-lbl">Your answer</div><div class="cmm-ans">${E(res.answers[i]||"") || "<i>No answer</i>"}</div></div>
        <div><div class="cmm-lbl">Answer key</div><ul class="cmm-keylist">${q.key.map((k,j)=>`<li class="${ai?(hit.has(j+1)?"hit":"miss"):""}">${ai?(hit.has(j+1)?"✓ ":"✗ "):""}${E(k)}</li>`).join("")}</ul>
        ${pq.note?`<div class="cmm-qnote">${E(pq.note)}</div>`:""}</div></div></div>`; }).join("")}
    <div class="cmm-actions"><button class="btn btn-ghost btn-sm" onclick="cmmRedo('${c.id}')">↻ Try Again</button>
      <span class="cmm-hint">Submitted ${fmtDate(res.submittedAt)}. Next: put each “what's next” into the CMS as a task.</span></div>
  </div>`;
}

/* ---------------- actions ---------------- */
window.cmmToggle = function(id){ state.cmmOpen = state.cmmOpen===id ? null : id; render(); setTimeout(()=>{ const el=document.getElementById("cmm_"+id); if(el && state.cmmOpen) el.scrollIntoView({block:"start",behavior:"smooth"}); }, 30); };
window.cmmDraft = function(id, i, v){ (MS.drafts[id] = MS.drafts[id] || {})[i] = v; persist(); };
window.cmmRedo = function(id){ state.cmmRedo = state.cmmRedo || {}; state.cmmRedo[id] = true; MS.drafts[id] = Object.assign({}, MS.results[id] && MS.results[id].answers); render(); };

function gradingPrompt(c, answers){
  return `You are a senior Case Manager at a personal-injury law firm, reviewing a trainee's work on a critical-thinking checkpoint.
The point of the exercise is the CM MINDSET: verify every fact against its source document, catch discrepancies, anticipate what could hurt the case, spot what is due or missing, and decide the next action and who needs to know.

Case: John Doe v. Apex Delivery Services (and, on Day 5, the Jordan Davies file). Checkpoint: "${c.title}".
Situation: ${c.scenario}

For each question, compare the trainee's answer with the numbered key points. A key point counts as "hit" when the answer clearly covers its substance, even in different words. Give credit for correct reasoning and document citations. Do not credit vague statements ("check the records") that don't name the specific issue. Score each question 0-10.

${c.qs.map((q,i)=>`QUESTION ${i+1}: ${q.q}
KEY POINTS:
${q.key.map((k,j)=>`  ${j+1}. ${k}`).join("\n")}
TRAINEE ANSWER: ${String(answers[i]||"").trim() || "(no answer)"}`).join("\n\n")}

Return ONLY JSON (no markdown):
{"score": 0-100 overall,
 "questions": [{"q": 1, "score": 0-10, "hit": [key point numbers covered], "note": "one sentence: the most important thing they missed or got right"}],
 "strengths": ["1-3 specific things they did well"],
 "blindSpots": ["1-3 specific things a Case Manager must catch next time"],
 "mindset": "2 sentences on how they think: do they verify and cite, spot risk, and act proactively?"}`;
}

window.cmmSubmit = async function(e, id){
  e.preventDefault();
  const c = CHECKPOINTS.find(x=>x.id===id); if(!c) return;
  const answers = c.qs.map((_,i)=> (document.getElementById(`cmmq_${id}_${i}`)||{}).value || "");
  if(answers.filter(a=>a.trim().length>=15).length < Math.ceil(c.qs.length/2)){ toast("Answer at least half the questions properly before you submit."); return; }
  const btn = document.getElementById("cmmsub_"+id); if(btn){ btn.disabled = true; btn.textContent = "Reviewing your answers…"; }
  let ai = null, aiError = null;
  try{
    ai = await callAIJson(gradingPrompt(c, answers), 2400, 120000);
    if(!ai || typeof ai.score!=="number") throw new Error("the review came back incomplete");
    ai.score = Math.max(0, Math.min(100, Math.round(ai.score)));
  }catch(err){ ai = null; aiError = (err && err.message) || String(err); }
  const prev = MS.results[id];
  MS.results[id] = { answers, submittedAt: new Date().toISOString(), attempts: (prev ? prev.attempts : 0) + 1,
    best: ai ? Math.max(ai.score, prev && prev.best!=null ? prev.best : 0) : (prev ? prev.best : null), ai, aiError };
  if(state.cmmRedo) delete state.cmmRedo[id];
  await storeSet(KEY, MS);
  toast(ai ? `Checkpoint scored: ${ai.score}%. Compare your answers with the key.` : "Submitted. Compare your answers with the key.");
  render();
};

/* ---------------- trainer view ---------------- */
function renderTrainerTools(){
  const t = state.cmmTrainee;
  return `<div class="card cmm-sec cmm-trainer"><h2>🔑 For Trainers</h2>
    <details><summary><b>Full case summary (answer key)</b>: trainees don't see this</summary>
      <div class="profile-grid" style="margin-top:12px">${(typeof CLIENT_PROFILE_DOC!=="undefined"?CLIENT_PROFILE_DOC:[]).map(sec=>`<div class="card profile-section"><h3>${E(sec.section)}</h3><ul>${sec.items.map(i=>`<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}</div></details>
    <div class="cmm-tr"><b>Review a trainee's checkpoints</b>
      <button class="btn btn-ghost btn-sm" onclick="cmmLoadTrainees()">${state.cmmTrainees?"↻ Refresh":"Load trainees"}</button>
      ${state.cmmTrainees ? `<select onchange="cmmPickTrainee(this.value)"><option value="">Choose a trainee…</option>${state.cmmTrainees.map(r=>`<option value="${E(r.id)}" ${t&&t.id===r.id?"selected":""}>${E(r.name)}${r.batch?" · "+E(r.batch):""}</option>`).join("")}</select>` : ""}</div>
    ${t ? (t.loading ? `<p>Loading…</p>` : renderTraineeWork(t)) : ""}
  </div>`;
}
function renderTraineeWork(t){
  const w = t.work || {}, res = w.results || {};
  return `<div class="cmm-tw"><p><b>${E(t.name)}</b>: ${Object.keys(res).length} of ${CHECKPOINTS.length} checkpoints submitted.</p>
    ${CHECKPOINTS.map(c=>{ const r = res[c.id]; if(!r) return `<div class="cmm-twrow"><span class="cmm-day">Day ${c.day}</span> ${E(c.title)} <span class="cmm-todo">Not submitted</span></div>`;
      return `<details class="cmm-twrow"><summary><span class="cmm-day">Day ${c.day}</span> <b>${E(c.title)}</b> <span class="cmm-score ${r.best>=85?"good":r.best>=70?"mid":r.best!=null?"low":""}">${r.best!=null?pct(r.best):"no score"}</span> <span class="cmm-hint">${r.attempts} attempt${r.attempts===1?"":"s"} · ${fmtDate(r.submittedAt)}</span></summary>
        ${r.ai?`<p class="cmm-mindset">${E(r.ai.mindset||"")}</p>${(r.ai.blindSpots||[]).length?`<p><b>Blind spots:</b> ${r.ai.blindSpots.map(E).join(" · ")}</p>`:""}`:""}
        ${c.qs.map((q,i)=>`<div class="cmm-q done"><div class="cmm-qh"><span class="cmm-n">${i+1}</span><b>${E(q.q)}</b></div><div class="cmm-ans">${E(r.answers[i]||"") || "<i>No answer</i>"}</div></div>`).join("")}</details>`; }).join("")}</div>`;
}
window.cmmLoadTrainees = async function(){
  try{
    const keys = await sharedList("trainee:");
    const recs = (await Promise.all(keys.map(k=>sharedGet(k).catch(()=>null)))).filter(r=>r && !r.archived);
    state.cmmTrainees = recs.map(r=>({id:r.id, name:r.name||"Trainee", batch:r.batch||""})).sort((a,b)=>a.name.localeCompare(b.name));
  }catch(e){ toast("Couldn't load trainees: " + ((e&&e.message)||e)); }
  render();
};
window.cmmPickTrainee = async function(id){
  if(!id){ state.cmmTrainee = null; render(); return; }
  const r = (state.cmmTrainees||[]).find(x=>x.id===id) || {id, name:id};
  state.cmmTrainee = {id, name:r.name, loading:true}; render();
  let snap = null; try{ snap = await sharedGet("progress:"+id); }catch(e){}
  state.cmmTrainee = {id, name:r.name, work: (snap && snap.data && snap.data[KEY]) || {}}; render();
};

/* ---------------- styles ---------------- */
const css = document.createElement("style"); css.id = "cm-mindset-css"; css.textContent = `
.cmm-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:16px;margin:16px 0}
@media(max-width:860px){.cmm-top{grid-template-columns:1fr}}
.cmm-snap,.cmm-mind,.cmm-sec{padding:18px 20px}
.cmm-snap h3,.cmm-mind h3{margin:0 0 10px;color:var(--navy);font-size:16px}
.cmm-snap dl{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:0;font-size:13.5px}
.cmm-snap dt{font-weight:800;color:var(--ink-soft);font-size:12px;text-transform:uppercase;letter-spacing:.04em;padding-top:2px}
.cmm-snap dd{margin:0;color:var(--ink)}
.cmm-note{margin:12px 0 0;font-size:12.8px;background:#FFF7ED;border-radius:10px;padding:8px 12px;color:#7C2D12}
.cmm-m{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-top:1px solid #F0EDE6}.cmm-m:first-of-type{border-top:none}
.cmm-m>span{font-size:18px;line-height:1.2}.cmm-m b{color:var(--navy);font-size:13.5px}.cmm-m p{margin:2px 0 0;font-size:12.8px;color:var(--ink-soft)}
.cmm-sec{margin-bottom:16px}.cmm-sec h2{margin:0 0 8px;color:var(--navy);font-size:19px}
.cmm-steps{margin:6px 0 12px;padding-left:20px;font-size:13.5px}.cmm-steps li{margin:5px 0}
.cmm-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}
.cmm-prog{font-size:12.5px;font-weight:700;color:var(--ink-soft)}
.cmm-lead{font-size:13.5px;color:var(--ink-soft);margin:0 0 12px;max-width:80ch}
.cmm-cp{margin-bottom:10px;padding:0;overflow:hidden}
.cmm-cp-h{display:flex;align-items:center;gap:10px;width:100%;background:none;border:0;padding:14px 18px;font:inherit;text-align:left;cursor:pointer;color:var(--navy)}
.cmm-cp-h b{flex:1;font-size:15px}.cmm-chev{color:var(--ink-soft)}
.cmm-day{font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;background:#EEF0F6;color:var(--navy);border-radius:999px;padding:3px 9px;white-space:nowrap}
.cmm-score{font-size:12px;font-weight:800;border-radius:999px;padding:3px 10px;background:#F1F5F9;white-space:nowrap}
.cmm-score.good{background:#EEF7F1;color:#166534}.cmm-score.mid{background:#FFFBEB;color:#B45309}.cmm-score.low{background:#FBEDEA;color:#B91C1C}
.cmm-todo,.cmm-lock{font-size:11.5px;font-weight:700;color:var(--ink-soft);white-space:nowrap}
.cmm-body{padding:0 18px 18px}
.cmm-q{margin:0 0 14px}.cmm-q label{display:flex;gap:8px;font-weight:700;color:var(--navy);font-size:13.8px;margin-bottom:6px}
.cmm-n{flex:0 0 22px;height:22px;border-radius:50%;background:var(--navy);color:#fff;font-size:12px;display:inline-flex;align-items:center;justify-content:center}
.cmm-q textarea{width:100%;box-sizing:border-box;font:inherit;font-size:13.5px;border:1px solid var(--line);border-radius:10px;padding:9px 11px;resize:vertical}
.cmm-key{font-size:12px;margin-top:5px;background:#FEF9C3;border-radius:8px;padding:6px 10px;color:#713F12}
.cmm-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px}.cmm-hint{font-size:12px;color:var(--ink-soft)}
.cmm-fb{display:flex;gap:16px;align-items:flex-start;background:#F8F9FC;border-radius:12px;padding:14px 16px;margin-bottom:14px;font-size:13.3px}
.cmm-fb-score{text-align:center;min-width:84px}.cmm-fb-score b{display:block;font-size:28px;color:var(--navy)}.cmm-fb-score span{font-size:11.5px;color:var(--ink-soft)}
.cmm-fb p{margin:0 0 6px}.cmm-mindset{font-style:italic}
.cmm-qh{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:13.8px;color:var(--navy)}.cmm-qh b{flex:1}
.cmm-qs{font-size:12px;font-weight:800;background:#EEF0F6;border-radius:999px;padding:2px 9px;white-space:nowrap}
.cmm-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:760px){.cmm-cols{grid-template-columns:1fr}}
.cmm-lbl{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-soft);margin-bottom:4px}
.cmm-ans{white-space:pre-wrap;font-size:13.2px;background:#fff;border:1px solid var(--line);border-radius:10px;padding:9px 11px;overflow-wrap:anywhere}
.cmm-keylist{margin:0;padding:0;list-style:none;font-size:13px}.cmm-keylist li{padding:5px 9px;border-radius:8px;margin-bottom:4px;background:#F8F9FC}
.cmm-keylist li.hit{background:#EEF7F1;color:#14532D}.cmm-keylist li.miss{background:#FBEDEA;color:#7F1D1D}
.cmm-qnote{font-size:12.3px;color:var(--ink-soft);margin-top:4px;font-style:italic}
.cmm-q.done{border-top:1px solid #F0EDE6;padding-top:12px}
.cmm-tr{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:14px 0 8px;font-size:13.5px}
.cmm-tr select{font:inherit;font-size:13px;padding:6px 9px;border:1px solid var(--line);border-radius:8px;max-width:100%}
.cmm-twrow{border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-bottom:8px;font-size:13px}
.cmm-twrow summary{cursor:pointer;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.cmm-trainer details>summary{cursor:pointer;font-size:13.5px}
`;
document.head.appendChild(css);
})();
