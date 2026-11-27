// @check node — Every Skill Activity practices what its deck lesson teaches: it uses that lesson's deck terms, names no method, order or step the Canva decks contradict, and dates no lesson to the wrong day
'use strict';
// The lessons are the owner's Canva deck pages (js/cm-deck-slides.js; their words are build/case-flow/slides/deck-pages.json,
// their narration each page's `notes`). A Skill Activity, its answer key (the slide's checks and its checkpoints), its rubric,
// its 💡 Tip and the day's Knowledge Check must teach and grade the deck's own method. Checked:
//   1. TERMS: for each deck lesson, the terms its pages teach (below). Each must still be on those pages (the table can't
//      drift from the deck), and every activity that practices the lesson must use at least MIN of them in its own text
//      (task, steps, checkpoints, rubric, slide copy): an activity that shares none of its lesson's words practices
//      something else. An activity that practices a drawn lesson must practice one the course still teaches.
//   2. CONTRADICTIONS: a method, order or name the decks state one way, written another way anywhere the trainee or the
//      grader reads it (activities, Knowledge Checks, the lessons and the 💡 Tips' rules, their slide copy and scripts).
//      Each rule first proves the deck still says it, so a rule can't outlive the page it rests on. Eight rules, the
//      eighth the escalation ladder: a Notice of Delay goes to the adjuster and the plaintiff's attorney, never to an office
//      manager or supervisor, who are Level 1 (Day 1 deck p48).
//   3. DAYS: "Day N's No Contact Protocol" and the like must name the day that piece is taught on now (activities moved
//      to their deck's day; a reference to the old day sends the trainee to the wrong day).
// Usage: node .github/scripts/activity-deck-align.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
global.window = global;
require(path.join(ROOT, 'js/cm-deck-slides.js'));
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
require(path.join(ROOT, 'js/cm-lesson-tips.js'));
const CF = window.CM_CASE_FLOW, DECK = window.CM_DECK_SLIDES || {}, TIPS = (window.CM_LESSON_TIPS || {}).TIPS || {};
const SL = path.join(ROOT, 'build/case-flow');
const readJ = f => JSON.parse(fs.readFileSync(path.join(SL, f), 'utf8'));
const PAGES = readJ('slides/deck-pages.json');
const COPY = {}, SCRIPTS = {}, EXHIBITS = [];
for (let n = 1; n <= 5; n++) {
  for (const f of [`slides/d${n}.json`, `slides/theory-d${n}.json`]) if (fs.existsSync(path.join(SL, f))) Object.entries(readJ(f)).forEach(([k, v]) => { (COPY[k] = COPY[k] || []).push(v); });
  if (fs.existsSync(path.join(SL, `scripts/d${n}.json`))) Object.entries(readJ(`scripts/d${n}.json`)).forEach(([k, v]) => { SCRIPTS[k] = v; });
  if (fs.existsSync(path.join(SL, `exhibits/d${n}.json`))) EXHIBITS.push([`exhibits/d${n}.json`, fs.readFileSync(path.join(SL, `exhibits/d${n}.json`), 'utf8')]);
}
const norm = s => String(s).replace(/\*\*/g, '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/\s+/g, ' ');
const flat = o => typeof o === 'string' ? o + ' ' : Array.isArray(o) ? o.map(flat).join(' ') : o && typeof o === 'object' ? Object.values(o).map(flat).join(' ') : '';
const STORED = {}, MOD = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { STORED[b.id] = b; MOD[b.id] = m; })));
const DAY = {}; CF.sequence.forEach(sd => sd.phases.forEach(ph => ph.blocks.forEach(id => { DAY[id] = sd.n; })));
const deckText = l => norm((DECK[l] || []).map(p => { const dn = (p.img.match(/day(\d)/) || [])[1]; return [p.title, p.notes, ((PAGES[dn] || {})[p.page] || {}).w].join(' '); }).join(' '));
const fail = [];

// ── 1. The terms each deck lesson's pages teach (case-insensitive; each must be on the lesson's own pages)
const MIN = 2;
const TERMS = {
  'd1m1-l1': ['conflict check', 'naming convention', 'case file', 'verif(y|ied|ication)', 'next steps', 'task trackers?', 'misfiled', 'missing (or inconsistent )?(contact|client|information|signatures)', 'follow[- ]?up', 'eligibility', 'communication gaps?', 'document management', 'gap in treatment'],
  'd1m4-l1': ['coverage', 'liability', 'projection', 'policy limits?', 'recovery stack|\\bstack\\b', 'exhaust', 'regulatory triple-check', 'hipaa', 'bcrc', 'payor order|payer order', 'three-pillar', 'subrogation management', 'clinical', 'functional', 'coordinate, don\'t (just )?commingle', 'comparative negligence', 'police report'],
  'd1m4-tplan': ['facilitation', 'coordination', 'advocacy', 'girp', 'soap', 'motivational interviewing', 'warm handoff', 'referral leak', 'smart', 'pre-morbid', 'social determinants', 'vocational', 'care coordination', 'mission creep', 'barrier'],
  'd1m4-tmap': ['standard treatment map', 'acute', 'sub-acute', 'restorative', 'maintenance', 'variance', 'psychosocial', 'stakeholder triad', 'reasonable and necessary', 'a-c-t', 'clarify', 'escalation ladder', 'peer-to-peer', 'notice of delay', 'letter of protection', 'course correction', 'plateau', 'six-week'],
  'd1m4-tcare': ['red flags?', 'yellow flags?', 'treatment gaps?', 'missed appointments?', 'transportation', 'follow up immediately', 'explanations?', 'escalate', 'treatment timelines?', 'catastrophizing', 'passive', 'referrals?'],
  'd2m4-l1': ['trinity', 'narrative', 'physicality', 'medicals', 'master audit checklist', 'special damages', 'lost wages?', 'signed letter from the employer|employer letter', 'disability slip', 'lien resolution|liens?', 'liability proof', 'statement drift', 'chronology', 'coding audit', 'unbundling', 'duplicate', 'prior history', 'defense', 'social media', 'summary memo', 'exhibit index', 'policy limits?'],
  'd3m1-l1': ['big four', 'medical specials', 'narrative', 'liability proof', 'special damages', 'final scrub', 'billing overlaps?', 'pre-existing', 'balance verification|final balance', 'mmi|maximum medical improvement', 'gap check', '30-day rule', 'why factor', 'anchor', 'policy limit mindset', 'treatment gaps?'],
  'd3m2-l2': ['net sheet', 'value drivers?', 'set-off', 'pip', 'subrogation', 'strategic exhaustion', 'soft lead', 'professional pause', 'bracketing', 'stall', 'final-final', 'split the baby', 'never rule|never bid against yourself', 'paper trail', 'confirm the terms', 'authority', 'low-ball|low number'],
  'd3m1-l2': ['um/uim safety check', '30-day letter', 'waivers? of subrogation|subrogation waivers?', 'made whole', 'common fund', 'release of all claims', 'non-admission', 'indemn', 'hold harmless', 'settlement disclosure statement', 'cooling-off|rescission', 'payoff letter', 'satisfaction of lien', 'settlement statement', 'with prejudice', 'w-9', 'signature chase', 'notary'],
  'd3m3-l1': ['common fund', 'made whole', 'comparative fault', 'one[- ]third', 'quantum meruit', 'charging lien', 'time record', 'hold', 'lienholders?'],
  'd3m3-l2': ['pro rata', 'payoff letter', 'full and final', 'upcode', 'unbundle', 'duplicate', 'common fund', 'correct(ing|ion)', 'fully insured', 'attendance log'],
  'd3m4-l1': ['net sheet', 'two (recovery )?streams|stream 1|stream 2', 'double dipping', 'fee transparency', 'aggregate net', '25 (and|/) 75', 'master financial ledger', 'medical provider ledger', 'max offer', 'consent to settle', 'combined value', 'tender', 'proportion'],
  'd3m4-l2': ['conditions? precedent', 'verification', 'authorization', 'reconciliation', 'proof of identity', 'payment request', 'verified invoices', 'banking information|payment details', 'w-9', 'kickback protocol', 'change of circumstance', 'duplicate payments?', 'ready for payment', 'cleared'],
  'd3m4-close': ['money trail', 'itemized list of every check', 'transaction ids?', 'zero balance', 'proof of delivery', 'acknowledg(e)?ment of receipt', 'lien waivers?', 'w-9', 'duplication of benefits', 'closing memo', 'discrepancy notes', 'exception reports?', 'retention', '7 years', 'archived', 'payoff letter'],
  'd4m2-l2': ['mediator', 'arbitrator', 'neutral', 'facilitator', 'binding', 'three to four|3-4|3 to 4', 'notice of mediation', 'breakout rooms?', 'hearing date', 'brief deadline|brief', 'earlier business day', 'exhibit exchange', 'selection cutoff', 'retainer deposits?', 'golden rule', 'upl', 'log directives', 'summary memo', 'appeal'],
  'd4m3-l1': ['mediation binder', 'six sections', 'executive summary', 'snapshot', 'mediation order', 'fee (is )?split', 'confidential mediation statement', 'core pleadings', 'answer', 'affirmative defenses', 'deposition summar', 'negotiation log', 'limited release', 'three (identical )?(physical )?(binders|copies)', 'ocr', 'divider tabs', 'master index', 'five seconds'],
  'd4m3-prior': ['prior medical shield', '2021', 'no significant degenerative change', 'causation letter'],
  'd4m3-l2': ['arbitration binder', 'arbitration submissions', 'fee disclosures', 'amended complaint|superseded', 'biomechanical', 'grayscale|color', 'event data recorder', 'consolidated medical ledger', 'economic losses', 'audited lien', 'compromise traps', 'decision-makers|full settlement authority', 'brief misalignment', 'landmines?', 'excluded', 'pre-existing', 'deadline misses|hard brief cutoff', '48-hour pre-session audit', 'reconcil(e|ing) liens early', 'eob'],
  'd5m1-l1': ['pleadings', 'affidavit of service', 'alternative service', 'interrogatories', 'requests for production|rfps?', 'requests for admission|rfas?', 'deemed admitted', 'discovery intake meeting', 'verification page', 'docket', 'scheduling order', 'in writing', '30, 14,? and 7', 'caption', 'registered agent', '3 days|3 for mail', 'litigation file architecture|sub-folders', 'pre-lit and lit'],
  'd5m1-l2': ['final run', 'trial subpoena', 'indexed and tabbed', '48 hours', '7 days before', 'every 30 days', '48-hour docket rule', 'requests for admission|rfa', 'every 10 days', 'zero defaults', '14-day service milestone', 'clean discovery check', 'kpis?'],
  'd5m1-subp': ['subpoena duces tecum', 'exhibit a', 'motion to quash', 'fishing expedition', 'narrow', 'registered agent', 'records custodian', 'invoice'],
  'd5m2-l1': ['economic', 'non-economic', 'punitive', 'lesser-of|lesser of', 'diminished value', 'loss of use', 'repair', 'sentimental', '17c', 'margaret', 'make[- ]whole|made whole'],
  'd5m3-l1': ['pre-deposition audit', 'pillar', 'anxiety', 'two-second pause', "liar's trap", 'stop talking', 'dress code', 'business casual', 'day before', 'backup', 'personal background', 'medical history', 'daily life', 'logistics', 'court reporter'],
  'd5m3-l2': ['is that all', 'thoughtful silence|silent stare|silent trap', 'golden rules', 'tell the truth|truth', 'pause', 'answer out loud|spoken answer', 'never guess|no guessing', 'keep it short|brevity', 'argu', 'objection'],
  'd5m4-l2': ['skip trace|skip-trace', 'process server', 'want of prosecution', 'alternative service', 'vary(ing)?', '118 larkspur', 'quarry ridge']
};
const reOf = t => new RegExp(t, 'i');
for (const [l, ts] of Object.entries(TERMS)) {
  if (!DECK[l]) { fail.push(`TERMS lists ${l}, which has no deck pages: take it out of the table`); continue; }
  const d = deckText(l);
  ts.forEach(t => { if (!reOf(t).test(d)) fail.push(`TERMS: "${t}" is not on ${l}'s deck pages any more: the table must list only what the pages teach`); });
}
const actText = b => norm([b.title, b.topic, b.act, b.ops, b.best, (b.rubric.ai || []).concat(b.rubric.trainer || []).map(r => r[0] + ' ' + r[2]), COPY[b.id]].map(flat).join(' '));
let deckActs = 0, drawnActs = 0;
CF.sequence.forEach(sd => sd.phases.forEach(ph => ph.blocks.forEach(id => {
  const b = STORED[id]; if (!b || b.kind !== 'activity') return;
  const of = (ph.practises || {})[id], l = STORED[of];
  if (!of || !l) return fail.push(`Day ${sd.n}: ${id} practices no lesson`);
  if (!DECK[of]) {
    drawnActs++;
    if (l.retired || !DAY[of]) fail.push(`Day ${sd.n}: ${id} practices ${of}, a drawn lesson the course no longer teaches: point it at the deck lesson that teaches its skill`);
    return;
  }
  deckActs++;
  const ts = TERMS[of];
  if (!ts) return fail.push(`Day ${sd.n}: ${id} practices the deck lesson ${of}, which has no TERMS entry here: list the terms its pages teach`);
  const t = actText(b), hit = ts.filter(x => reOf(x).test(t));
  if (hit.length < MIN) fail.push(`Day ${sd.n}: ${id} practices ${of} (deck p${DECK[of].map(p => p.page).join(',')}) but uses ${hit.length ? 'only ' + hit.map(x => `"${x}"`).join(', ') : 'none'} of the terms those pages teach (needs ${MIN}): it practices something else. Re-point it to the deck lesson that teaches its skill, or rewrite it in this lesson's terms`);
})));

// ── 2. What the trainee and the grader read: activities, Knowledge Checks (and their quiz), the lessons taught and the
// lessons whose rules are 💡 Tips, their slide copy and scripts, and the exhibits' audit keys
const TIPPED = new Set(Object.values(TIPS).flat());
const CORPUS = [];
Object.values(STORED).forEach(b => {
  if (!DAY[b.id] && !TIPPED.has(b.id)) return;   // not in the course, and no Tip shows its rules
  if (b.kind === 'lesson' && (DECK[b.id] || b.retired)) return CORPUS.push([`${b.id} (💡 Tip)`, JSON.stringify(b.tell || {})]);   // its drawn slides are not shown: only its Tip is
  const quiz = b.kind === 'check' ? (MOD[b.id].quiz || []).map(q => [q.q, (q.opts || [])[q.a], q.r]) : [];   // a wrong option is meant to be wrong
  CORPUS.push([b.id, JSON.stringify(b) + JSON.stringify(quiz)]);
  if (COPY[b.id]) CORPUS.push([`${b.id} (slide copy)`, JSON.stringify(COPY[b.id])]);
  if (SCRIPTS[b.id]) CORPUS.push([`${b.id} (script)`, JSON.stringify(SCRIPTS[b.id])]);
});
EXHIBITS.forEach(e => CORPUS.push(e));
Object.keys(CF).filter(k => !['days', 'sequence'].includes(k)).forEach(k => CORPUS.push([`the Case File (CM_CASE_FLOW.${k})`, JSON.stringify(CF[k])]));   // the trainer's answer key
// [name, the deck lesson that teaches it, what its pages must still say, what contradicts it, the deck's own words]
const CONTRA = [
  ['A-C-T', 'd1m4-tmap', /\bAssess\b[\s\S]{0,400}\bClarify\b[\s\S]{0,400}\bTrack\b/,
    [/\bAssess\b[^.;"]{0,200}\bCoordinate\b[^.;"]{0,200}\bTrack\b/i, /\bAssess[:,][\s\S]{0,700}?\bCoordinate[:,][\s\S]{0,500}?\bTrack[:,]/, /"Assess"[^\]]{0,500}\]\s*,\s*\[\s*"Coordinate"/, /\bCOORDINATE\b[^.;"]{0,40}\bTRACK\b/, /A-C-T[^.]{0,200}\bCoordinate:/],
    'A-C-T is Assess, Clarify, Track (Day 1 deck p42): the middle step is Clarify, the call to the provider\'s office'],
  ['the Three-Pillar Case Plan', 'd1m4-l1', /Clinical[\s\S]{0,200}Functional[\s\S]{0,400}Subrogation Management/i,
    [/Clinical,? Functional,? (and )?Financial/i, /\bfinancial pillar/i, /Financial: how the Medical Bills/],
    'the three pillars are Clinical, Functional and Subrogation Management (Day 1 deck p24, p26)'],
  ['the Payer Order', 'd1m4-l1', /PIP[\s\S]{0,40}MedPay[\s\S]{0,80}Private Health Insurance[\s\S]{0,80}LOP/i,
    [/\b(Peach State|health plan|private health insurance)\s*(→|->|, then)\s*(PIP|MedPay)\b/i, /\bLOP\s*(→|->)\s*(PIP|MedPay|Peach State|health plan)/i],
    'the Payer Order is PIP/MedPay, then private health insurance, then LOP and provider liens (Day 1 deck p23, p25)'],
  ['the stack order', 'd3m4-l1', /BI, then Host UM, then Relative UM/,
    [/\b(Host UM|Relative UM)\s*(→|->)\s*BI\b/, /\bRelative UM\s*(→|->)\s*Host UM\b/],
    'the order is BI, then Host UM, then Relative UM (Day 1 deck p21, Day 3 deck p6)'],
  ['the Golden Rules for testifying', 'd5m3-l2', /seven golden rules/i,
    [/\b(five|six|eight|nine|ten|[5689]) Golden Rules\b/i],
    'there are seven Golden Rules (Day 5 deck p17-19)'],
  ['the binder sections', 'd4m3-l1', /six sections/i,
    [/\b(four|five|seven|eight|[4578])-(section|tab) (Mediation|Arbitration) Binder/i],
    'each binder has six sections (Day 4 deck p9, p15, p25)'],
  ['the 48-hour pre-session audit', 'd4m3-l2', /48-hour pre-session audit/i,
    [/48-Hour Mandate audit/i],
    'the deck names it the 48-hour pre-session audit (Day 4 deck p35)'],
  ['the escalation ladder', 'd1m4-tmap', /Level one, clinical: contact the provider's office manager[\s\S]{0,120}Level two, administrative: send a notice of delay to the adjuster and the plaintiff's attorney[\s\S]{0,160}Level three, legal/i,
    [/Notice of Delay[^.;"]{0,60}\b(to|for)\b[^.;"]{0,30}\b(office manager|supervisor)/i, /\b(office manager|supervisor)\b[^.;"]{0,30}\b(with|as) (a |the )?(written )?Notice of Delay/i, /Rung 2:? (is )?its supervisor/i],
    'the levels are 1, clinical, the provider\'s office manager; 2, administrative, a Notice of Delay to the adjuster and the plaintiff\'s attorney; 3, legal, the attorney\'s motion to compel or LOP (Day 1 deck p48)']
];
for (const [name, l, must, bad, why] of CONTRA) {
  if (!must.test(deckText(l))) { fail.push(`CONTRA "${name}": ${l}'s deck pages no longer say what this rule rests on: update the rule`); continue; }
  CORPUS.forEach(([where, text]) => bad.forEach(re => { const m = norm(text).match(re); if (m) fail.push(`${where}: "${m[0].slice(0, 90)}" contradicts the deck: ${why}`); }));
}

// ── 3. "Day N's <piece>" must name the day the piece is taught on now
const AT = [   // [what the text names, the block that teaches it]
  [/\bDay ([1-5])'s No Contact Protocol/, 'd1m2-l1'],
  // (an activity cut from the course: the one that now does its work, since the owner cut the extra tasks)
  [/\bDay ([1-5])'s (?:Skip-Trace )?(?:gate|three criteria)/, 'd2m2-a2'],
  [/\bDay ([1-5]) (?:SSDI\/BCRC )?check\b/, 'd1m4-a2'],
  [/\bDay ([1-5])'s order[- ]of[- ]operations/, 'd1m1-open'],
  [/\bWhich Day ([1-5]) work product/, 'd3m1-a1'],
  [/\bDay ([1-5])'s fourth element/, 'd2m2-a2'],
  [/\bDay ([1-5])'s letter\b/, 'd2m2-a2']
];
AT.forEach(([re, id]) => {
  if (!DAY[id]) return fail.push(`DAYS: ${id} is not in the course's order: update the table`);
  CORPUS.forEach(([where, text]) => { const g = new RegExp(re.source, 'g'); let m; while ((m = g.exec(norm(text)))) if (+m[1] !== DAY[id]) fail.push(`${where}: "${m[0]}" names Day ${m[1]}, but ${id} is taught on Day ${DAY[id]}`); });
});

if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`Activities align with their decks: ${deckActs} practice a deck lesson in its own terms (at least ${MIN} each), ${drawnActs} a drawn lesson still taught; ${CONTRA.length} deck methods, orders and names contradicted nowhere; every day reference current.`);
