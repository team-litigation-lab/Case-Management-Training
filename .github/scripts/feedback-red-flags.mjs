// @check node — the feedback table's 🚩 red flags name the real risks (a wrong Case ID, legal advice, a disclosure, a date not set, a document not filed), quote the finding, skip a note saying it didn't happen, and split "to improve" from "what could have been done better"
// Usage: node .github/scripts/feedback-red-flags.mjs
import fs from 'fs'; import vm from 'vm';
const src = fs.readFileSync('js/cm-batch-sheet.js', 'utf8');
const cut = (a, b) => { const i = src.indexOf(a); if (i < 0) throw new Error('missing ' + a); const j = src.indexOf(b, i); return src.slice(i, j); };
const code = [cut('const clip = ', '\n'), cut('const ADVICE = ', '/* 🚩'), cut('const FLAGS = [', 'const lis = ')].join('\n');
const ctx = {}; vm.createContext(ctx); vm.runInContext(code + '\nthis.splitImprove = splitImprove; this.redFlags = redFlags;', ctx);
const fails = [], kinds = (y) => ctx.redFlags(y).map(f => f.why.split(':')[0]);
const sp = ctx.splitImprove(['The binder carries Case ID 000102, but this file\'s snapshot ID is 770412 → open CMS → Case File and confirm the Case ID', 'Practice that one check on every file you open this week.', 'Only 11 of 20 source files are filed']);
if (sp.fix.length !== 2 || !/snapshot ID is 770412$/.test(sp.fix[0]) || sp.better.length !== 2 || !/^open CMS/.test(sp.better[0]) || !/^Practice/.test(sp.better[1])) fails.push(`the finding and the fix aren't split at the →: ${JSON.stringify(sp)}`);
const cases = [
  [['The binder header carries Case ID LSH-2026-MVA-000102, but this file\'s snapshot ID is LSH-2026-MVA-770412'], 'Wrong file or Case ID'],
  [['The callback window was not set'], 'A date not set or missed'],
  [['You predicted the outcome to John'], 'Legal advice or an outcome predicted'],
  [['You forwarded the medical records to the adjuster without a HIPAA release'], 'Privacy or privilege'],
  [['Contingency Fee Agreement not filed: 1 attempt refused'], 'A required document not filed or backed up'],
  [['Nothing in the record gives the client legal advice'], ''],
  [['Case notes & logs: GIRP note filed 03/04/2026, labelled privileged'], ''],
  [['Case opened & verified: CMS Case ID logged on the Submit slide'], '']];
for (const [imp, want] of cases) { const got = kinds({ name: '🧪 An activity', improve: imp }).join(' + ');
  if (got !== want) fails.push(`"${imp[0]}" flags "${got}", should be "${want || 'nothing'}"`); }
const q = ctx.redFlags({ name: '🧪 X', improve: ['The callback window was not set → put it on the calendar'] })[0];
if (!q || q.quote !== 'The callback window was not set') fails.push(`a flag should quote the finding (before its →): ${JSON.stringify(q)}`);
const cms = ctx.redFlags({ name: '🗂 CMS case file', status: '9 missing', improve: ['SOL, calendar & tasks: Logistics exact', 'Case notes & logs: GIRP note filed, labelled privileged'] });
if (cms.length !== 1 || !/incomplete/.test(cms[0].why) || !/2 required entries are missing/.test(cms[0].quote)) fails.push(`the CMS case file's flag should be the file incomplete, with the count: ${JSON.stringify(cms)}`);
if (fails.length) { console.error('Feedback red flags check FAILED:\n- ' + fails.join('\n- ')); process.exit(1); }
console.log('Feedback red flags check passed (each risk flagged and quoted; a note saying it didn\'t happen, and a checklist entry naming the topic, are no flag; the CMS file\'s flag is its missing count; the finding and its fix split at the →).');
