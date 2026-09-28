#!/usr/bin/env python3
"""Builds index.html from the EA/PA portal (index.html) + CM content."""
import re, sys, os
B = os.path.dirname(os.path.abspath(__file__))
# Usage: python3 build/build.py <path to the EA/PA portal's index.html>
# The EA/PA portal is the EA-PA-TRAINING repository. The CM course was last
# built from its main after #10 (the facilitation flow). Writes index.html here.
if len(sys.argv) != 2:
    sys.exit("usage: python3 build/build.py <EA-PA-TRAINING/index.html>")
SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(B), "index.html")
s = open(SRC, encoding="utf8").read()
rd = lambda f: open(os.path.join(B, f), encoding="utf8").read().strip()

def block(start_marker, end_marker, text, include_end=True):
    i = text.index(start_marker)
    j = text.index(end_marker, i)
    return i, (j + len(end_marker) if include_end else j)

def replace_block(start, end, new, include_end=True):
    global s
    i, j = block(start, end, s, include_end)
    s = s[:i] + new + s[j:]

def rep(old, new, count=None, min_count=1):
    global s
    n = s.count(old)
    if n < min_count:
        sys.exit(f"MISSING ({n}): {old[:90]!r}")
    s = s.replace(old, new) if count is None else s.replace(old, new, count)

# ---------- 1. day data ----------
days = "\n\n".join(rd(f"day{i}.js") for i in range(1, 6))
i = s.index("const DAY1 = {")
j = s.index("const DAYS = [DAY1")
j2 = s.index("\n", j)
s = s[:i] + days + "\n\nconst DAYS = [DAY1, DAY2, DAY3, DAY4, DAY5];" + s[j2:]

# ---------- 2. data blocks ----------
replace_block("const PRACTICE_TOOLS = [", "\n];\n", rd("cm_practice_tools.js") + "\n")
replace_block("const DAY_ORDER = [", "\n];\n", rd("cm_calendar.js") + "\n")
replace_block("const CLIENT_PROFILE_DOC = [", "\n];\n", rd("cm_casefile.js") + "\n")
rp = rd("cm_roleplay.js")
cats_personas, crisis = rp.split("const CRISIS_SCENARIO_SETS = ")
replace_block("const ROLEPLAY_CATEGORIES = [", "\n];\n", cats_personas.split("const ROLEPLAY_PERSONAS")[0].strip() + "\n")
replace_block("const ROLEPLAY_PERSONAS = [", "\n];\n", "const ROLEPLAY_PERSONAS" + cats_personas.split("const ROLEPLAY_PERSONAS")[1].strip() + "\n")
replace_block("const CRISIS_SCENARIO_SETS = {", "\n};\n", "const CRISIS_SCENARIO_SETS = " + crisis.strip() + "\n")
replace_block("const SOP_DATA = [", "\n];\n", "const SOP_DATA = []; // CM: SOP is generated from the live day content (sopForDay)\n")

# ---------- 3. drop EA-only heavy assets / keyed content ----------
s = "\n".join(l for l in s.split("\n") if not l.startswith('LESSON_DIAGRAMS["'))
s = re.sub(r'const LESSON_EXTRA_LEARNING = \{.*?\};\n', 'const LESSON_EXTRA_LEARNING = {};\n', s, count=1, flags=re.S)
s = re.sub(r'const ELIAS_VOICE_NOTE_AUDIO_DATAURI = "[^"]*";', 'const ELIAS_VOICE_NOTE_AUDIO_DATAURI = "";', s, count=1)
s = re.sub(r'const CLIENT_AVATAR_SRC = \(.*?\n', 'const CLIENT_AVATAR_SRC = "";\n', s, count=1)

# ---------- 4. branding ----------
rep("<title>LSH EA/PA Upskill Program</title>", "<title>LSH Case Management Training</title>")
rep('<b>LSH EA/PA Upskill Program</b><span>10-Day Interactive Training</span>', '<b>LSH Case Management Training</b><span>5-Day Interactive Training</span>')
rep("LSH EA / PA Upskill Program", "LSH Case Management Training")
rep("LSH EA/PA — Platform Orientation", "LSH Case Management — Platform Orientation")
rep("Legal Support Help · EA/PA Upskill Program", "Legal Support Help · Case Management Training")
rep("Legal Support Help  ·  EA/PA Upskill Program", "Legal Support Help  ·  Case Management Training")
rep("10-Day Legal Executive &amp; Personal Assistant Professional Development Training", "5-Day Legal Case Management Professional Development Training")
rep("10-Day Legal Executive & Personal Assistant Professional Development Training", "5-Day Legal Case Management Professional Development Training")
rep("Welcome to EA / PA Upskill Program", "Welcome to LSH Case Management Training")
rep('<p class="eyebrow">LEGAL EA / PA ACCELERATOR</p>', '<p class="eyebrow">LEGAL CASE MANAGEMENT ACCELERATOR</p>')
rep('certId:`LSH-EAPA-', 'certId:`LSH-CM-')
rep('var APP_BUILD = "', 'var APP_BUILD = "cm-')
rep('"EA/PA Trainee"', '"Case Management Trainee"')
rep("Eligible when all 10 Knowledge Checks are passed (70%+).", "Eligible when all 5 Knowledge Checks are passed (70%+).")

# ---------- 5. 10-day → DAYS.length ----------
rep('const msg = done===10', 'const msg = done===DAYS.length')
rep('"🎉 You\'ve completed all 10 days — congratulations on finishing the program."', '`🎉 You\'ve completed all ${DAYS.length} days — congratulations on finishing the program.`')
rep("You're on <b>Day ${nextDayId()} of 10</b>", "You're on <b>Day ${nextDayId()} of ${DAYS.length}</b>")
rep('<span class="dhc-eyebrow">Day ${d.id} of 10</span>', '<span class="dhc-eyebrow">Day ${d.id} of ${DAYS.length}</span>')
rep("${d.id<10 ? (dayUnlocked(d.id+1)", "${d.id<DAYS.length ? (dayUnlocked(d.id+1)")
rep("(d.id===10 && lastPassed", "(d.id===DAYS.length && lastPassed")
rep("Array.from({length:10},(_,i)=>i+1).map(n=>{", "Array.from({length:DAYS.length},(_,i)=>i+1).map(n=>{")
rep('<div class="lbl">Finished all 10 days</div>', '<div class="lbl">Finished all ${DAYS.length} days</div>', min_count=1)

# ---------- 6. day slides / task overview wording ----------
rep('if(slide.type==="taskOverview") return "Legal EA Task Overview";', 'if(slide.type==="taskOverview") return "Case Manager Task Overview";')
rep('if(slide.type==="meetClient") return "Meet Elias Thorne — Live Q&A";', 'if(slide.type==="meetClient") return "Meet the Case — John Doe v. Apex";')
rep('<h2 class="section-title">Legal EA Task Overview</h2>', '<h2 class="section-title">Case Manager Task Overview</h2>')
rep("Six areas cover most of what a Legal Executive Assistant handles day to day.", "Six areas cover most of what a personal-injury Case Manager handles day to day.")

# ---------- 7. navigation & views ----------
rep('let views = [["dashboard","Dashboard"],["tasks","🎲 Tasks"],["clientprofile","Client Profile"],["practice","Practice Lab"],["crisisroleplay","🔥 Live Roleplay"],["notes","My Notes"],["handouts","Handouts"]];',
    'let views = [["dashboard","Dashboard"],["tasks","🎲 Tasks"],["clientprofile","Case File"],["casedocs","📁 Documents"],["practice","Skill Builders"],["tools","🧰 Tools"],["crisisroleplay","🔥 Roleplay"],["notes","Notes"],["handouts","Handouts"]];')
rep('else if(state.view==="tasks") body=renderTasksPage();',
    'else if(state.view==="tasks") body=renderTasksPage();\n  else if(state.view==="casedocs") body=renderCaseDocuments();\n  else if(state.view==="tools"||state.view==="cms") body=renderTrainingTools();')
rep('const PAGE_EYEBROWS = {clientprofile:"Your Client", practice:"Practice Lab",', 'const PAGE_EYEBROWS = {clientprofile:"Case File", casedocs:"Case Documents", tools:"Training Tools", cms:"Training Tools", practice:"Skill Builders",')
rep('<p class="eyebrow">Practice Lab</p>\n    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 10px;">Let\'s Practice the Principles</h1>',
    '<p class="eyebrow">Skill Builders</p>\n    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 10px;">Skill Builders — Practice on the Real Case File</h1>')
rep("Hands-on tools for the skills that show up every day on the job. Each day's Practice Lab opens when you reach that day",
    "Every Skill Builder comes from the Skill Building slides and runs on the actual case documents — then sends you into the CMS to do the file work. Each day's Skill Builders open when you reach that day")

# ---------- 8. AI prompts: EA → Case Manager ----------
rep("You are an automated competency evaluator grading a trainee Executive Assistant's submission for a legal-industry EA training program.",
    "You are an automated competency evaluator grading a trainee personal-injury Case Manager's submission for a legal-industry Case Management training program.")
rep("- Executive Presence & Judgment (0-30 points): tone, confidence, discretion, and the quality of judgment shown — would a real executive trust this work.",
    "- Executive Presence & Judgment (0-30 points): professional judgment, client advocacy, tone and discretion — would a handling attorney trust this work on a real file.")
rep("You are an automated evaluator grading a trainee Executive/Personal Assistant's performance in a live, unscripted roleplay call.",
    "You are an automated evaluator grading a trainee personal-injury Case Manager's performance in a live, unscripted roleplay call.")
rep("You are generating the OPENING LINE for a live, unscripted roleplay training call for an Executive/Personal Assistant.",
    "You are generating the OPENING LINE for a live, unscripted roleplay training call for a personal-injury Case Manager.")
rep("CLIENT BACKGROUND (for context on who might be calling — Elias Thorne, his firm, his household):",
    "CASE BACKGROUND (John Doe v. Apex — the caller may be the client, an adjuster, a provider, a lienholder, opposing counsel or the handling attorney):")
rep("dropping the EA/PA straight into the situation", "dropping the Case Manager straight into the situation")
rep("If the EA/PA is handling it well", "If the Case Manager is handling it well")
rep('placeholder="Speak your reply — or type it here as the EA/PA..."', 'placeholder="Speak your reply — or type it here as the Case Manager..."')
rep('placeholder="Type your response as the EA..."', 'placeholder="Type your response as the Case Manager..."')
rep("Respond as the EA — stay calm, give options, don't over-promise.", "Respond as the Case Manager — stay calm, be specific, don't over-promise or give legal advice.")
rep("Generate one unscripted, realistic task delegation for a Legal Executive/Personal Assistant trainee",
    "Generate one unscripted, realistic case-handling task for a personal-injury Case Manager trainee")
rep("the kind that would actually land on an EA/PA's desk", "the kind that would actually land on a Case Manager's desk")
rep("CLIENT CONTEXT:\n${CLIENT_DOSSIER_MD}", "CASE FILE CONTEXT:\n${CLIENT_DOSSIER_MD}", min_count=1)
rep("You are reviewing a note written by a trainee in a Legal Executive Assistant / Personal Assistant training program",
    "You are reviewing a note written by a trainee in a personal-injury Case Management training program")
rep("You are writing a trainer-style performance evaluation for an Executive Assistant / Personal Assistant trainee",
    "You are writing a trainer-style performance evaluation for a personal-injury Case Manager trainee")
rep("Program: LSH (Legal Support Help) 10-day EA/PA Upskill Program for Legal Executive & Personal Assistants",
    "Program: LSH (Legal Support Help) 5-day Case Management Training for personal-injury Case Managers")
rep('a 2-3 sentence scenario involving Elias Thorne, "whatToDo": 2-3 sentences on what a strong EA/PA does}', 'a 2-3 sentence scenario from the John Doe v. Apex file, "whatToDo": 2-3 sentences on what a strong Case Manager does}')
rep('"purpose": 2-3 sentences on why it matters to an EA/PA and the firm,', '"purpose": 2-3 sentences on why it matters to a Case Manager and the firm,')
rep("<b>What a strong EA/PA does:</b>", "<b>What a strong Case Manager does:</b>")
rep("(short realistic situations with Elias Thorne)", "(short realistic situations from the John Doe v. Apex file)")
rep("Elias Thorne scenarios are realistic.", "John Doe case scenarios are realistic.")
# (The AI speaker-script prompt was removed from the EA/PA engine: scripts are no longer written by AI.)
rep('"If Elias handed you this exact situation today, what would your first move be?"', '"If this landed on your John Doe file today, what would your first move be?"')
rep("Apply the Day ${id} concepts to real EA/PA work for Elias Thorne.", "Apply the Day ${id} concepts to the John Doe v. Apex case file.")
rep("Welcome to LSH EA PA Upskill Training Day ${id}.", "Welcome to LSH Case Management Training Day ${id}.")
rep("ppt:`EA PA Day ${id}`, canvaLabel:`EA PA Day ${id}`", "ppt:`Revised CM Training Day ${id}`, canvaLabel:`CM Day ${id}`")
rep("{id:\"presence\", label:\"Executive Presence & Judgment\", tip:\"Lead with a recommendation, not just options — write as if Elias will act on it immediately.\"}",
    "{id:\"presence\", label:\"Professional Judgment & Advocacy\", tip:\"Lead with a recommendation, not just options — write as if the handling attorney will act on it immediately.\"}")
rep('label:"Unscripted Call Blitz", sub:"Timed", icon:"⏱️", desc:"A live, ticking timer and no help text. Anyone could be calling — Elias, a vendor',
    'label:"Unscripted Call Blitz", sub:"Timed", icon:"⏱️", desc:"A live, ticking timer and no help text. Anyone could be calling — the client, an adjuster')
rep('"Elias\'s spouse is calling about a scheduling conflict with tonight\'s dinner reservation.",', '"John Doe\'s wife Jane calls asking whether she needs her own claim for her neck pain.",')

# ---------- 8b. orientation, dashboard hero, content studio ----------
rep('["Client Profile","Everything about your client, Elias Thorne. Read it first."],["Practice Lab","All hands-on tools — each opens with its day."]',
    '["Case File","John Doe v. Apex — the working case. Read it first."],["📁 Case Documents","Every record, bill, lien letter and pleading — with its CMS upload category."],["🧪 Practice","Every practice tool, organized the same way for each day: 🧠 Skill Builders on the case documents, 🗣 Communication (live calls, roleplay, email) and 🗂 Systems (the CMS, docket, medical records, e-filing, calendar and trust ledger). Each day\'s tools open with that day."]')
rep('["🔥 Live Roleplay","Voice calls with realistic clients and crises."],', '')
_i = s.index('{k:"Client", h:"Meet your client: Elias Thorne", body:`')
_j = s.index('</div>`},', _i) + len('</div>`},')
CLIENT_SLIDE = ('{k:"Client", h:"Meet the case: John Doe v. Apex Delivery Services", body:`\n'
  '      <div class="or-client">\n        <div class="or-avatar">JD</div>\n'
  '        <div><p class="or-lead" style="margin-top:0">A Valentine\'s Day T-bone by an Apex commercial F-150 that ran a red light — extrication, facial scarring, a lumbar herniation and surgery. Every lesson, Skill Builder and CMS exercise works this one file (Day 5 adds Jordan Davies).</p>\n'
  '        <ul class="or-list"><li>Read the <b>Case File</b> before Day 1, then open the documents in <b>📁 Case Documents</b>.</li><li>The documents contain real-world inconsistencies — catching them is the job.</li><li>Treat everything as confidential, like a real client file.</li></ul></div>\n'
  '      </div>`},')
s = s[:_i] + CLIENT_SLIDE + s[_j:]
rep('Pass all <b>10 Knowledge Checks</b> (70%+)', 'Pass all <b>${DAYS.length} Knowledge Checks</b> (70%+)')
rep('${step(2,"📇","Client Profile","Read about Elias Thorne.")}', '${step(2,"📂","Case File","Read the John Doe v. Apex file.")}')
rep('{k:"Practice", h:"Practice Labs: how grading works", body:`', '{k:"Practice", h:"Skill Builders: how grading works", body:`')
s = re.sub(r'Executive Assistant/ Personal Assistant Professional Development Wo[^<]*', 'Case Management Professional Development Workshop', s, count=1)
rep("Unlock your full potential as a Strategic Go-To Person to your Attorney. Minimize cognitive load, streamline execution, and act as a true force multiplier.",
    "Run a personal-injury file from intake to disbursement: verify every document, keep treatment on the map, audit before demand, negotiate the net, and stay trial-ready.")
rep("Running client case: Elias Thorne, Managing Owner & CEO of Thorne & Partners Law Group.", "Running case: John Doe v. Apex Delivery Services (commercial T-bone, facial scarring, L4-L5 microdiscectomy).")
rep('"a 2-sentence discussion case involving Elias Thorne"', '"a 2-sentence discussion case from the John Doe v. Apex file"')

# ---------- 8c. "Practice Lab" → "Skill Builders" in user-facing text ----------
s = s.replace("Practice Labs", "Skill Builders").replace("Practice Lab", "Skill Builders")

# ---------- 9. scripts ----------
# EA/PA's hand-written speaker notes are EA/PA content; the CM course keeps its own trainer cues.
s = re.sub(r'<script src="/js/presenter-notes\.js[^"]*"></script>\n?', '', s)
s = re.sub(r'<script src="/js/eapa-updates\.js\?v=[^"]*"></script>', '<script src="/js/eapa-updates.js?v=z"></script>', s, count=1)
rep('<script src="/js/eapa-updates.js?v=z"></script>', '<script src="/js/cm-updates.js?v=8"></script>\n<script src="/js/cm-documents.js?v=1"></script>\n<script src="/js/cm-skillbuilders.js?v=12"></script>\n<script src="/js/cm-mindset.js?v=1"></script>\n<script src="/js/cm-practice.js?v=2"></script>')

# ---------- 10. Call Simulator + Live Roleplay CM fixes ----------
rep('["practice","Skill Builders"],["tools","🧰 Tools"]', '["practice","Skill Builders"],["calls","🛠 Simulators"],["tools","🧰 Tools"]')
rep('else if(state.view==="tools"||state.view==="cms") body=renderTrainingTools();', 'else if(state.view==="tools"||state.view==="cms") body=renderTrainingTools();\n  else if(state.view==="calls") body=renderCallSimulator();')
rep('tools:"Training Tools", cms:"Training Tools",', 'tools:"Training Tools", cms:"Training Tools", calls:"Simulators",')
# personal keys sync to the cloud (cms-log was missing) + keep the lists from shrinking
rep('"quick-check-answers","last-view","lab-drafts","work-log","cert-name","reg-name","intro-seen","task-log","task-day-since"];', '"quick-check-answers","last-view","lab-drafts","work-log","cert-name","reg-name","intro-seen","task-log","task-day-since","cms-log"];')
rep('  state.roleplayHistory = [];\n  state.assignedRoleplay = null;', '  state.roleplayHistory = [];\n  state.cmsLog = {};\n  state.assignedRoleplay = null;')
rep('  await storeSet("roleplayHistory", []);\n  await storeSet("day10-window", null);', '  await storeSet("roleplayHistory", []);\n  await storeSet("cms-log", {});\n  await storeSet("day10-window", null);')
# Live Roleplay: Quick Practice drew from EA topic ids (empty pool in CM → crash)
rep('const QUICK_PRACTICE_TOPIC_IDS = ["inboxtriage","boardgatekeeping","investorupdate","calendarcollision","vendornegotiation","domesticstaff","traveldisruption","coldobjections","bantqualifying"];',
    'const QUICK_PRACTICE_TOPIC_IDS = ["transportwall","treatmentdebt","deponerves","firstcall","umconsent","lopreduction","recordsdelay","mediationsched","extension"];')
rep("trainee Executive/Personal Assistant's performance in a short, casual practice call", "trainee personal-injury Case Manager's performance in a short, casual practice call")
rep("You are roleplaying as the caller/contact in a live, unscripted training call for an Executive/Personal Assistant.", "You are roleplaying as the caller/contact in a live, unscripted training call for a personal-injury Case Manager.")
rep("that would realistically drop on an Executive/Personal Assistant's desk in quick succession", "that would realistically drop on a personal-injury Case Manager's desk in quick succession")
rep('      "A vendor just texted asking for same-day payment confirmation on an overdue invoice.",', '      "Metro Radiology\'s records department calls: John Doe\'s authorization has the wrong DOB and they won\'t release the MRI.",')
rep('      "A colleague needs the quarterly report reformatted and resent in the next 10 minutes.",', '      "The attorney needs the updated lien totals for the Doe file in the next 10 minutes.",')
rep('      "The building manager left a voicemail about an access badge issue for tomorrow."', '      "A court clerk leaves a voicemail: the Answer in another matter was rejected for a missing signature page."')
rep('of a 10-day Legal Executive/Personal Assistant program.', 'of the 5-day LSH Case Management program.')
n = s.count('"EA: "'); assert n >= 4, n
s = s.replace('"EA: "', '"CASE MANAGER: "')

open(OUT, "w", encoding="utf8").write(s)
left = {w: len(re.findall(w, s)) for w in ["Elias", "Thorne", "EA/PA", "EA / PA", "10-Day", "Executive Assistant"]}
print("wrote", OUT, f"{len(s)/1e6:.2f} MB", "leftovers:", left)
