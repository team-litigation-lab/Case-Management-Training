// @check node — an AI review the server refuses with its own reason (the trainee's access revoked) shows that reason, not "your account type"
// Usage: node .github/scripts/ai-error-reason.mjs
import fs from 'fs'; import vm from 'vm';
const html = fs.readFileSync('index.html', 'utf8'), i = html.indexOf('function friendlyAiError(e){');
if (i < 0) { console.error('AI error reason check FAILED: no friendlyAiError in index.html'); process.exit(1); }
let depth = 0, j = html.indexOf('{', i);
for (; j < html.length; j++) { if (html[j] === '{') depth++; else if (html[j] === '}' && --depth === 0) break; }
const ctx = { state: {} }; vm.createContext(ctx); vm.runInContext(html.slice(i, j + 1), ctx);
const f = (m) => ctx.friendlyAiError(new Error(m)), fails = [];
const rev = 'Your access to this program has been revoked. Contact your trainer if you believe this is a mistake.';
if (f('AI service error 403: ' + rev) !== rev) fails.push(`a revoked trainee isn't told so: ${f('AI service error 403: ' + rev)}`);
if (!/account type/.test(f('AI service error 403: Forbidden'))) fails.push('a 403 with no reason no longer gets the sign-out advice');
if (!/AI_GATEWAY_SECRET/.test(f('AI service error 502: Portal AI gateway: Not allowed.'))) fails.push('the Portal gateway refusing the site is put on the trainee');
// a review that fails (refused, the AI down) gives back the repeat attempt it spent (runRubricEvaluation)
const rr = html.slice(html.indexOf('async function runRubricEvaluation('), html.indexOf('async function runRubricEvaluation(') + 9000);
if (!/const spent = state\.lastLabAttempt;/.test(rr) || !/catch\(err\)\{ if\(spent\)\{ state\.lastLabAttempt = Object\.assign\(\{\}, spent, \{at: Date\.now\(\)\}\); refundLastLabAttempt\(\); \} throw err; \}/.test(rr))
  fails.push('a failed AI review no longer gives back the repeat attempt it spent');
if (fails.length) { console.error('AI error reason check FAILED:\n- ' + fails.join('\n- ')); process.exit(1); }
console.log('AI error reason check passed (a refusal with the server\'s reason shows it; a bare 403 keeps the sign-out advice; the gateway\'s refusal is named as the site\'s setup; a failed review gives back its attempt).');
