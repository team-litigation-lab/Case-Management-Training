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
# Where the built page goes. CM_BUILD_OUT sends it somewhere else, so a check can run the build
# without overwriting the committed page (.github/scripts/build-from-eapa, in Checks).
OUT = os.environ.get("CM_BUILD_OUT") or os.path.join(os.path.dirname(B), "index.html")
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

def gone(old, why):
    """An edit EA/PA has since made for itself. If the old text comes back, the edit is needed
    again, so stop rather than quietly skipping it."""
    if old in s:
        sys.exit(f"BACK: {old[:90]!r} — EA/PA carries this text again; restore the edit ({why})")

# ---------- 1. day data ----------
# EA/PA keeps each day in js/days/dayN/lessons.js and assembles DAYS from window.EA_DAY_FILES
# (ten files, with a "didn't load" banner). The CM course's days are the Case Flow's, built by
# js/cm-case-flow.js from js/cm-case-flow-data.js, so DAYS starts empty and none of those files is loaded.
# (build/day1.js-day5.js, the earlier John Doe v. Apex course, are kept only as the source the Case Flow's
# lessons cite: build/case-flow/curriculum.cjs maps every one of their topics; nothing of them is served.)
s, n = re.subn(r'<script src="/js/days/day(?:[1-9]|10)/lessons\.js[^"]*"></script>\n?', "", s)
if n != 10:
    sys.exit(f"MISSING: expected 10 js/days/dayN/lessons.js tags, removed {n}")
DAY_FILES_START = "const DAY_FILES = window.EA_DAY_FILES || {};"
if DAY_FILES_START not in s:
    sys.exit(f"MISSING: {DAY_FILES_START!r} — EA/PA changed how DAYS is assembled")
i, j = block(DAY_FILES_START, "\n}\n", s)          # through the MISSING_DAYS banner
s = s[:i] + "const DAYS = [];   // the course's days are the Case Flow's: js/cm-case-flow.js fills DAYS\n" + s[j:]

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
# EA/PA records its own topic-order history in DAY_LAYOUTS so a trainee's saved place follows a topic
# that moved. Those are EA/PA's topic titles and layout ids ("email-management", "credibility-day1"),
# meaningless for a CM day: applied to CM they move saved places to the wrong slide, so the list is emptied here.
replace_block("const DAY_LAYOUTS = [", "\n];\n", "const DAY_LAYOUTS = [];   // CM: the Case Flow's days have no EA/PA topic history\n")

# ---------- 3. drop EA-only heavy assets / keyed content ----------
s = "\n".join(l for l in s.split("\n") if not l.startswith('LESSON_DIAGRAMS["'))
# The extra-learning boxes are keyed per day and live in the day files above, which CM doesn't load.
rep("const LESSON_EXTRA_LEARNING = Object.assign({}, ...DAYS.map(d=>DAY_FILES[d.id].extraLearning || {}));",
    "const LESSON_EXTRA_LEARNING = {};   // CM: the per-day files these came from are not loaded")
s = re.sub(r'const ELIAS_VOICE_NOTE_AUDIO_DATAURI = "[^"]*";', 'const ELIAS_VOICE_NOTE_AUDIO_DATAURI = "";', s, count=1)
s = re.sub(r'const CLIENT_AVATAR_SRC = \(.*?\n', 'const CLIENT_AVATAR_SRC = "";\n', s, count=1)

# ---------- 4. branding ----------
# The standardized LSH logo (the same files as the Training Portal's): the full logo, js/lsh-logo-dark.png, and the
# square mark, favicon.png. Both have a white outline, so they read on navy and on white.
import base64
def data_uri(path):
    return "data:image/png;base64," + base64.b64encode(open(os.path.join(os.path.dirname(B), path), "rb").read()).decode()
s, n1 = re.subn(r'const LOGO_FULL_DATAURI = "data:image/png;base64,[^"]*";', lambda m: f'const LOGO_FULL_DATAURI = "{data_uri("js/lsh-logo-dark.png")}";', s, count=1)
s, n2 = re.subn(r'const LOGO_ICON_DATAURI = "data:image/png;base64,[^"]*";', lambda m: f'const LOGO_ICON_DATAURI = "{data_uri("favicon.png")}";', s, count=1)
if not (n1 and n2):
    sys.exit(f"MISSING logo anchors: {n1} {n2}")
rep("<title>LSH EA/PA Upskill Program</title>", "<title>LSH Case Management Training</title>")
rep('<b>EA/PA UPSKILL PROGRAM</b>', '<b>CASE MANAGEMENT TRAINING</b>')   # the universal page header: the program's name in capitals, nothing beside it
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
# These three were hardcoded "10" when this script was written; EA/PA now writes DAYS.length (or has
# rewritten the copy), so there is nothing to change. gone() stops the build if the old text returns.
gone('const msg = done===10', "day-count copy")
gone('"🎉 You\'ve completed all 10 days — congratulations on finishing the program."', "day-count copy")
gone("You're on <b>Day ${nextDayId()} of 10</b>", "day-count copy")
rep('<span class="dhc-eyebrow">Day ${d.id} of 10</span>', '<span class="dhc-eyebrow">Day ${d.id} of ${DAYS.length}</span>')
rep("${d.id<10 ? (dayUnlocked(d.id+1)", "${d.id<DAYS.length ? (dayUnlocked(d.id+1)")
rep("(d.id===10 && lastPassed", "(d.id===DAYS.length && lastPassed")
rep("Array.from({length:10},(_,i)=>i+1).map(n=>{", "Array.from({length:DAYS.length},(_,i)=>i+1).map(n=>{")
rep('<div class="lbl">Finished all 10 days</div>', '<div class="lbl">Finished all ${DAYS.length} days</div>', min_count=1)

# ---------- 6. day slides / task overview wording ----------
rep('if(slide.type==="taskOverview") return "Legal EA Task Overview";', 'if(slide.type==="taskOverview") return "Case Manager Task Overview";')
rep('if(slide.type==="meetClient") return "Meet Elias Thorne — Live Q&A";', 'if(slide.type==="meetClient") return "Meet the Case — John Doe v. Robert Smith";')
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
rep("Hands-on tools for the skills that show up every day on the job. Every day's Practice Lab is open — start any of them at any time.",
    "Every Skill Builder comes from the Skill Building slides and runs on the actual case documents — then sends you into the CMS to do the file work. Every day's Skill Builders are open — start any of them at any time.")

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
    "CASE BACKGROUND (John Doe v. Robert Smith — the caller may be the client, an adjuster, a provider, a lienholder, opposing counsel or the handling attorney):")
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
rep('a 2-3 sentence scenario involving Elias Thorne, "whatToDo": 2-3 sentences on what a strong EA/PA does}', 'a 2-3 sentence scenario from the John Doe v. Robert Smith file, "whatToDo": 2-3 sentences on what a strong Case Manager does}')
rep('"purpose": 2-3 sentences on why it matters to an EA/PA and the firm,', '"purpose": 2-3 sentences on why it matters to a Case Manager and the firm,')
rep("<b>What a strong EA/PA does:</b>", "<b>What a strong Case Manager does:</b>")
rep("(short realistic situations with Elias Thorne)", "(short realistic situations from the John Doe v. Robert Smith file)")
rep("Elias Thorne scenarios are realistic.", "John Doe case scenarios are realistic.")
# (The AI speaker-script prompt was removed from the EA/PA engine: scripts are no longer written by AI.)
rep('"If Elias handed you this exact situation today, what would your first move be?"', '"If this landed on your John Doe file today, what would your first move be?"')
rep("Apply the Day ${id} concepts to real EA/PA work for Elias Thorne.", "Apply the Day ${id} concepts to the John Doe v. Robert Smith case file.")
rep("Welcome to LSH EA PA Upskill Training Day ${id}.", "Welcome to LSH Case Management Training Day ${id}.")
rep("ppt:`EA PA Day ${id}`, canvaLabel:`EA PA Day ${id}`", "ppt:`Revised CM Training Day ${id}`, canvaLabel:`CM Day ${id}`")
rep("{id:\"presence\", label:\"Executive Presence & Judgment\", tip:\"Lead with a recommendation, not just options — write as if Elias will act on it immediately.\"}",
    "{id:\"presence\", label:\"Professional Judgment & Advocacy\", tip:\"Lead with a recommendation, not just options — write as if the handling attorney will act on it immediately.\"}")
rep('label:"Unscripted Call Blitz", sub:"Timed", icon:"⏱️", desc:"A live, ticking timer and no help text. Anyone could be calling — Elias, a vendor',
    'label:"Unscripted Call Blitz", sub:"Timed", icon:"⏱️", desc:"A live, ticking timer and no help text. Anyone could be calling — the client, an adjuster')
rep('"Elias\'s spouse is calling about a scheduling conflict with tonight\'s dinner reservation.",', '"John Doe\'s wife Jane calls asking whether she needs her own claim for her neck pain.",')

# ---------- 8b. orientation, dashboard hero, content studio ----------
rep('["Client Profile","Everything about your client, Elias Thorne. Read it first."],["Practice Lab","All hands-on tools — each opens with its day."]',
    '["Case File","John Doe v. Robert Smith — the working case. Read it first."],["📁 Case Documents","Every record, bill, lien letter and pleading — with its CMS upload category."],["🧪 Practice","The Case Flow\'s Skill Activities, a page per day: each with its tool, its expected output and the documents it works from. Each day\'s tools open with that day."]')
rep('["🔥 Live Roleplay","Voice calls with realistic clients and crises."],', '')
_i = s.index('{k:"Client", h:"Meet your client: Elias Thorne", body:`')
_j = s.index('</div>`},', _i) + len('</div>`},')
CLIENT_SLIDE = ('{k:"Client", h:"Meet the case: John Doe v. Robert Smith", body:`\n'
  '      <div class="or-client">\n        <div class="or-avatar">JD</div>\n'
  '        <div><p class="or-lead" style="margin-top:0">John Doe, a front-seat passenger, was hurt on 02/06/2026 when Robert Smith rolled through a stop sign and struck the car he rode in: a C5-C6 disc herniation, a 14-day gap before treatment, and $40,000 of BI and UM coverage to work. Every lesson, Skill Activity and CMS exercise works this one file.</p>\n'
  '        <ul class="or-list"><li>Read the <b>Case File</b> before Day 1, then open the documents in <b>📁 Case Documents</b>.</li><li>The documents contain real-world inconsistencies — catching them is the job.</li><li>Treat everything as confidential, like a real client file.</li></ul></div>\n'
  '      </div>`},')
s = s[:_i] + CLIENT_SLIDE + s[_j:]
rep('Pass all <b>10 Knowledge Checks</b> (70%+)', 'Pass all <b>${DAYS.length} Knowledge Checks</b> (70%+)')
rep('${step(2,"📇","Client Profile","Read about Elias Thorne.")}', '${step(2,"📂","Case File","Read the John Doe v. Robert Smith file.")}')
rep('{k:"Practice", h:"Practice Labs: how grading works", body:`', '{k:"Practice", h:"Skill Builders: how grading works", body:`')
s = re.sub(r'Executive Assistant/ Personal Assistant Professional Development Wo[^<]*', 'Case Management Professional Development Workshop', s, count=1)
rep("Unlock your full potential as a Strategic Go-To Person to your Attorney. Minimize cognitive load, streamline execution, and act as a true force multiplier.",
    "Run a personal-injury file from intake to disbursement: verify every document, keep treatment on the map, audit before demand, negotiate the net, and stay trial-ready.")
rep("Running client case: Elias Thorne, Managing Owner & CEO of Thorne & Partners Law Group.", "Running case: John Doe v. Robert Smith (a passenger injury: C5-C6 herniation, the 14-Day Treatment Gap, a $40,000 BI + Host UM + Relative UM stack).")
rep('"a 2-sentence discussion case involving Elias Thorne"', '"a 2-sentence discussion case from the John Doe v. Robert Smith file"')

# ---------- 8c. "Practice Lab" → "Skill Builders" in user-facing text ----------
s = s.replace("Practice Labs", "Skill Builders").replace("Practice Lab", "Skill Builders")

# ---------- 8d. the AI-reviewed writing buttons read "Review" ----------
# Every button that sends written work to the AI reviewer says "Review" (js/cm-skillbuilders.js and
# labPolish in js/cm-updates.js do it for the labs). The Notes page is
# drawn here, and said "✨ Get Review" before the review and "✨ Get Feedback" after it.
rep('''id="aiBtn_${n.id}">✨ Get Review</button>''', '''id="aiBtn_${n.id}">Review</button>''')
# (EA/PA now resets it to "✨ Get Review"; either way it reads "Review" here.)
if not re.search(r'btn\.disabled = false; btn\.textContent = "✨ Get (?:Feedback|Review)";', s):
    sys.exit("MISSING (0): the Notes review button's reset (btn.textContent = \"✨ Get Feedback\" or \"✨ Get Review\")")
s = re.sub(r'btn\.disabled = false; btn\.textContent = "✨ Get (?:Feedback|Review)";', 'btn.disabled = false; btn.textContent = "Review";', s)

# ---------- 8e. the Trainee Audit isn't read twice when the Admin screen opens ----------
# liveTick's admin branch refreshes the ledger as soon as state.liveAdminAt is unset, so opening the
# Admin screen read the whole ledger twice in a row (a /api/storage/list + a get-many each time).
# The explicit loaders now stamp liveAdminAt, so the live check waits a full interval.
# This is an EA/PA engine bug: fix it upstream in EA-PA-TRAINING too, then these edits become no-ops
# (rep() will fail loudly if the upstream text changes, which is the signal to drop them).
rep('''async function loadAdminLedgerQuiet(){
  const keys = await sharedList("trainee:");''', '''async function loadAdminLedgerQuiet(){
  // The Trainee Audit was just read, so the live check waits a full interval instead of reading it
  // again straight away (liveTick's admin branch runs at once while state.liveAdminAt is unset).
  state.liveAdminAt = Date.now();
  const keys = await sharedList("trainee:");''')
rep('''  state.adminLoading = true;
  const keys = (await sharedList("trainee:")).map''', '''  state.adminLoading = true;
  // As in loadAdminLedgerQuiet: opening the Admin screen reads the ledger here, so the live check
  // doesn't repeat the same list + get-many a moment later.
  state.liveAdminAt = Date.now();
  const keys = (await sharedList("trainee:")).map''')

# ---------- 9. scripts ----------
# The CM course loads its own set. None of these files exists in EA/PA, so each one is INSERTED here:
# if a tag is left out, the feature it carries disappears from the course silently (the deck lessons,
# the one-screen layout, Presenter view's notes and scripts, Activities, the dashboard band).
def tags(*names):
    return "\n".join(f'<script src="/js/{n}"></script>' for n in names)

# EA/PA's per-day trainer notes and slide scripts → the CM course's own (same job, CM content).
s, n = re.subn(r'<script src="/js/days/day(?:[1-9]|10)/(?:notes|scripts)\.js[^"]*"></script>\n?', "", s)
if n != 20:
    sys.exit(f"MISSING: expected 20 js/days/dayN/(notes|scripts).js tags, removed {n}")
# EA/PA's per-day lesson slide copy (window.EA_SLIDE_COPY, read only if present) is EA/PA content, so it
# goes too; the Case Flow's slide copy is js/cm-case-flow-slides.js.
s = re.sub(r'<script src="/js/days/day(?:[1-9]|10)/slides\.js[^"]*"></script>\n?', "", s)
# ...and its illustrations for that copy (EAPA_ART, also read only if defined).
s = re.sub(r'<script src="/js/eapa-deck-art\.js[^"]*"></script>\n?', "", s)

# One hook — eapa-updates.js — becomes the CM run, in load order.
s = re.sub(r'<script src="/js/eapa-updates\.js\?v=[^"]*"></script>', '<script src="/js/eapa-updates.js?v=z"></script>', s, count=1)
rep('<script src="/js/eapa-updates.js?v=z"></script>', tags(
    "cm-updates.js?v=28",
    "cm-documents.js?v=3",
    "cm-skillbuilders.js?v=cm-2026.10.21-cmstab",
    "cm-lor-data.js?v=1", "cm-hipaa-data.js?v=1", "cm-medprov-data.js?v=1",   # Drafting Tools' data
    "cm-lor.js?v=3", "cm-hipaa.js?v=2", "cm-medprov.js?v=2", "cm-drafting.js?v=1",
    "daily-activities.js?v=3"))
# Attendance is taken on the Main Portal (no Admin → 🕘 Attendance tab here, as in EA/PA): only the trainee's
# automatic Time In stays (js/checkin.js), just before portal-link.js, whether or not EA/PA still carries attendance.js
s = re.sub(r'<script src="/js/attendance\.js\?v=[^"]*"></script>\n?', '', s)
rep('<script src="/js/portal-link.js?v=3"></script>', '<script src="/js/checkin.js?v=1"></script>\n<script src="/js/portal-link.js?v=3"></script>')
# the Trainer blueprint's content is this course's own (js/blueprint-content.js): its version, not EA/PA's
s = re.sub(r'<script src="/js/blueprint-content\.js\?v=[^"]*"></script>', '<script src="/js/blueprint-content.js?v=6"></script>', s, count=1)

# graded-calls moves down beside the dashboard band; lsh-dashboard and show-password are CM-only.
# EA/PA's Orientation script is EA/PA's own; this course has none (every blueprint is on the Main Portal).
rep('<script src="/js/graded-calls.js?v=1"></script>\n', "")
s = re.sub(r'<script src="/js/eapa-orientation\.js\?v=[^"]*"></script>\n?', "", s)
rep('<script src="/js/lsh-card-frame.js?v=3"></script>', tags(
    "lsh-dashboard.js?v=4", "graded-calls.js?v=1",
    # The 5-Day Case Management Flow (John Doe v. Robert Smith): after graded-calls.js, because its
    # dashboard wrapper must run on the finished page, and after cm-skillbuilders.js, whose
    # renderLessonCard it wraps.
    "cm-case-flow-docs.js?v=9", "cm-case-flow-art.js?v=3", "cm-case-flow-slides.js?v=17", "cm-case-flow-scripts.js?v=8", "cm-case-flow-sim.js?v=10", "cm-case-flow-data.js?v=21", "cm-case-dates.js?v=4", "cm-case-flow.js?v=51",
    "show-password.js?v=1", "lsh-card-frame.js?v=3"))

# Training tools open signed in (js/lsh-tool-links.js, the same file in every LSH course repo: CMS
# links and frames get a fresh ticket from /api/auth/tool-ticket). Then the top bar, then the
# one-screen layout last of all, because it measures the bar and the footer it has to fit between.
s = re.sub(r'<script src="/js/lsh-tool-links\.js\?v=[^"]*"></script>\n?', "", s)
rep('<script src="/js/lsh-topbar.js?v=2"></script>', tags(
    "lsh-tool-links.js?v=cm-2026.10.08-portal",
    # The CMS Case ID comes from the CMS (js/cm-cms-case.js), after the tool links it signs in with.
    "cm-cms-case.js?v=cm-2026.10.21-dol",
    # Case documents filed into the CMS, named the firm's way (js/cm-doc-filing.js).
    "cm-doc-filing.js?v=cm-2026.10.21-dol", "lsh-topbar.js?v=2", "lsh-one-screen.js?v=1"))

# ---------- 10. Call Simulator + Live Roleplay CM fixes ----------
rep('["practice","Skill Builders"],["tools","🧰 Tools"]', '["practice","Skill Builders"],["calls","🛠 Simulators"],["tools","🧰 Tools"]')
rep('else if(state.view==="tools"||state.view==="cms") body=renderTrainingTools();', 'else if(state.view==="tools"||state.view==="cms") body=renderTrainingTools();\n  else if(state.view==="calls") body=renderCallSimulator();')
rep('tools:"Training Tools", cms:"Training Tools",', 'tools:"Training Tools", cms:"Training Tools", calls:"Simulators",')
# personal keys sync to the cloud (cms-log was missing) + keep the lists from shrinking
# The keys synced to the cloud: drop EA/PA's own two, add the CM course's (cms-log, lab-subs).
rep('"task-day-since","outbound-calls","c6-audit"];', '"task-day-since","cms-log","lab-subs","case-flow","net-sheet"];')   # case-flow: the Case Flow track's Self-Summaries, self-ratings and scores; net-sheet: the trainee's LSH Net Sheet (net-sheet.html)
rep('  state.roleplayHistory = [];\n  state.assignedRoleplay = null;', '  state.roleplayHistory = [];\n  state.cmsLog = {};\n  state.labSubs = {};\n  state.labReviews = null;\n  state.assignedRoleplay = null;')
rep('  await storeSet("roleplayHistory", []);\n  await storeSet("day10-window", null);', '  await storeSet("roleplayHistory", []);\n  await storeSet("cms-log", {});\n  await storeSet("lab-subs", {});\n  await storeSet("day10-window", null);')
# Live Roleplay: Quick Practice drew from EA topic ids (empty pool in CM → crash)
rep('const QUICK_PRACTICE_TOPIC_IDS = ["inboxtriage","boardgatekeeping","investorupdate","calendarcollision","vendornegotiation","domesticstaff","traveldisruption","coldobjections","bantqualifying"];',
    'const QUICK_PRACTICE_TOPIC_IDS = ["cf-d1m3-a1","cf-d2m3-a1","cf-d2m2-a2","cf-d3m1-a1","cf-d3m2-a1","cf-d4m1-a1","cf-d4m3-a2","cf-d5m3-a1","cf-d5m4-a2"];')   # the Case Flow's calls (build/cm_roleplay.js)
rep("trainee Executive/Personal Assistant's performance in a short, casual practice call", "trainee personal-injury Case Manager's performance in a short, casual practice call")
rep("You are roleplaying as the caller/contact in a live, unscripted training call for an Executive/Personal Assistant.", "You are roleplaying as the caller/contact in a live, unscripted training call for a personal-injury Case Manager.")
rep("that would realistically drop on an Executive/Personal Assistant's desk in quick succession", "that would realistically drop on a personal-injury Case Manager's desk in quick succession")
rep('      "A vendor just texted asking for same-day payment confirmation on an overdue invoice.",', '      "Metro Radiology\'s records department calls: John Doe\'s authorization has the wrong DOB and they won\'t release the MRI.",')
rep('      "A colleague needs the quarterly report reformatted and resent in the next 10 minutes.",', '      "The attorney needs the updated lien totals for the Doe file in the next 10 minutes.",')
rep('      "The building manager left a voicemail about an access badge issue for tomorrow."', '      "A court clerk leaves a voicemail: the Answer in another matter was rejected for a missing signature page."')
rep('of a 10-day Legal Executive/Personal Assistant program.', 'of the 5-day LSH Case Management program.')
n = s.count('"EA: "'); assert n >= 4, n
s = s.replace('"EA: "', '"CASE MANAGER: "')

# ---------- guards: the output really is the five-day CM course ----------
# Ten-day copy that survived means an edit above stopped matching. (The Elias client-profile
# paragraph is EA/PA content CM replaces wholesale on its own Case File page, so it is not listed.)
for bad in ["of 10</b>", "done===10", "{length:10}", "Finished all 10 days", "Day ${d.id} of 10"]:
    if bad in s:
        sys.exit(f"LEFTOVER: {bad!r} — ten-day copy survived; the edit for it no longer matches")
# Every script the CM course needs must be in the page; a missing one loses its feature silently.
for need in ["cm-updates.js", "cm-documents.js", "cm-skillbuilders.js",
             "daily-activities.js",
             "lsh-dashboard.js", "lsh-one-screen.js", "lsh-tool-links.js", "lsh-topbar.js",
             "graded-calls.js", "show-password.js", "checkin.js", "portal-link.js", "portal-gate.js",
             "cm-lor-data.js", "cm-hipaa-data.js", "cm-medprov-data.js",
             "cm-lor.js", "cm-hipaa.js", "cm-medprov.js", "cm-drafting.js", "cm-case-flow-docs.js", "cm-case-flow-art.js", "cm-case-flow-slides.js", "cm-case-flow-scripts.js", "cm-case-flow-sim.js", "cm-case-flow-data.js", "cm-case-dates.js", "cm-case-flow.js", "cm-cms-case.js", "cm-doc-filing.js"]:
    if f'src="/js/{need}' not in s:
        sys.exit(f"MISSING SCRIPT: /js/{need} is not loaded by the built page")
# the AI-key messages name this course's Worker in Cloudflare, not EA/PA's
rep("Workers & Pages → ea-pa-training → Settings", "Workers & Pages → case-management-training → Settings", min_count=2)
rep("Workers &amp; Pages → ea-pa-training → Settings", "Workers &amp; Pages → case-management-training → Settings")
# and none of EA/PA's own day files should be
if "/js/days/day" in s:
    sys.exit("LEFTOVER: the page still loads EA/PA's js/days/dayN files")
if "EA_DAY_FILES" in s:
    sys.exit("LEFTOVER: the page still references window.EA_DAY_FILES")
if s.count("const DAYS = [];   // the course's days are the Case Flow's") != 1:
    sys.exit("DAYS is not the empty list js/cm-case-flow.js fills")
if re.search(r"const DAY\d+ = \{", s):
    sys.exit("LEFTOVER: a day object is inlined; the course's days are the Case Flow's")

open(OUT, "w", encoding="utf8").write(s)
left = {w: len(re.findall(w, s)) for w in ["Elias", "Thorne", "EA/PA", "EA / PA", "10-Day", "Executive Assistant"]}
print("wrote", OUT, f"{len(s)/1e6:.2f} MB", "leftovers:", left)
